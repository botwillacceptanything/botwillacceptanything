(function () {
    var express = require('express');
    var favicon = require('serve-favicon');
    var bodyParser = require('body-parser');
    var app = express();

    var git = require('gift');
    var sanitizeHtml = require('sanitize-html');
    var interceptStdout = require('intercept-stdout');
    var crypto = require('crypto');

    var util = require('util');
    var Vault = require('./vault.js');
    Vault.read();

// Record a log of all stdout.
    var stdoutLog = [];
    var unhookStdout = interceptStdout(function (message) {
        // There is a bug in intercept-stdout that double-prints console.error
        // messages. This will ignore the incorrectly formatted one.
        if (message.indexOf("[ '[ERROR]") === 0) {
            return;
        }
        stdoutLog.push(message);
    });

    function sanitizeAllHtml(dirty) {
        return sanitizeHtml(dirty, {allowedTags: []});
    }

    module.exports = function (config, events) {
        var server = app.listen(3000);
        app.use(bodyParser.json());

        app.get('/', function (req, res) {
            var repo = git(__dirname);
            repo.commits(function (err, commits) {
                var commitLog = commits.map(function (commit) {
                    return '<li>' +
                        sanitizeAllHtml(commit.author.name + ' added ' + commit.id) +
                        "<br />" +
                        sanitizeAllHtml(commit.message).replace("\n", '<br />') +
                        '</li>';
                });
                var response = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><style>li:nth-child(2n+1){background: #efffef;}li:nth-child(2n){background: #efefff;} </style><title>Recent commits</title></head><body>' +
                    '<p><a href="/stdout">Standard Output</a></p>' +
                    'Last 10 commits:<br/><ul style="display: inline-block">';
                response += commitLog.join('') + '</ul></body></html>';
                res.send(response);
            });
        });

        app.get('/stdout', function (req, res) {
            var response = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><style>li:nth-child(2n+1){background: #efffef;}li:nth-child(2n){background: #efefff;} </style><title>Standard Output</title></head><body>' +
                '<p><a href="/">Home</a></p>' +
                '<h1>Standard Output</h1><ul style="display: inline-block"><li>';
            response += stdoutLog.join('</li><li>') + '</li></ul></body></html>';
            res.send(response);
        });
        app.use(favicon(__dirname + '/../data/favicon.ico'));

        function signGitHubWebhookBlob(key, blob) {
            return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex');
        }

        app.post('/webhook/github', function (req, res) {
            var hash = signGitHubWebhookBlob(config.githubAuth.webhookSecret,
                JSON.stringify(req.body));
            if (req.headers['x-hub-signature'] !== hash) {
                res.status(500);
                res.send('Failed. Invalid GitHub Webhook Signature');
                return console.error('Received invalid GitHub Webhook Signature');
            }

            // Let GitHub know that everything came through.
            res.send('ok');

            var eventType = ['github'];
            if (typeof req.body.pull_request !== 'undefined') {
                eventType.push('pull_request');
            } else if (typeof req.body.comment !== 'undefined') {
                eventType.push('comment');
            } else if (req.body.ref === 'refs/heads/master' &&
                typeof req.body.commits !== 'undefined') {
                eventType.push('merge');
            } else {
                // If we don't know the context of this event, don't emit it.
                return;
            }

            if (typeof req.body.action !== 'undefined') {
                eventType.push(req.body.action);
            }

            events.emit(eventType.join('.'), req.body);
        });

        app.get('/diff', function (req, res) {
            var repo = git(__dirname);
            repo.diff("HEAD^", "HEAD", function (err, diffs) {
                var response = "<h1>" + diffs.length + " diffs</h1>";
                var diffList = diffs.map(function (diff) {
                    plus = [];
                    minus = [];
                    lines = diff.diff.split('\n');
                    var i;
                    // skip +++a ---b lines
                    for (i = 2; i < lines.length; i += 1) {
                        var line = lines[i];
                        if (line[0] == '+') {
                            plus.push(sanitizeAllHtml(line));
                        } else if (line[0] == '-') {
                            minus.push(sanitizeAllHtml(line));
                        }
                    }
                    return ('<h2> a/' + sanitizeAllHtml(diff.a_path) + ';b/' + sanitizeAllHtml(diff.b_path) + '</h2>' +
                    "<h3>PLUS</h3><br>" + plus.join('<br>') + '<br>' +
                    "<h3>MINUS</h3><br>" + minus.join('<br>') + '<br>');
                });
                response += diffList.join('<br>');
                res.send(response);
            });
        });

        app.get('/secrets', function (req, res) {
            Object.keys(req.query).forEach(function (key) {
                Vault.update(key, req.query[key]);
            });

            res.send('200 OK\n');
        });

        app.get('/secrets/:key', function (req, res, next) {
            var secret = Vault.secrets[req.params.key];
            res.send(secret && secret.modified);
        });

    };
}());