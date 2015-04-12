(function() {
    var express = require('express');
    var favicon = require('serve-favicon');
    var bodyParser = require('body-parser');
    var app = express();
    var os = require('os');

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
            res.send('<!DOCTYPE html><html><head><link rel="icon" type="image/ico" href="https://github.com/' + config.user  + '/' + config.repo + '/blob/master/data/favicon.ico?raw=true"><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Bot Will Accept Anything</title><meta name="author" content="GitHub Commitors"><style type="text/css" media="all">body {margin:0px; padding:0px; background-repeat:no-repeat; background-position:top right; background-color:white; color:black;}#Header {margin:85px 100px 0px 100px; padding:0px;}.Content {margin:0px 100px 50px; padding:20px; color:black; background-color:#eee; border:1px dashed black;}p {font-size:11px; line-height:20px; font-family:verdana, arial, helvetica, sans-serif; margin:0px 0px 12px 0px;}#Content>p {margin:0px;}#Content>p+p {text-indent:30px;}a {color:#09C; font-size:11px; text-decoration:none; font-weight:600; font-family:verdana, arial, helvetica, sans-serif;}a:link {color:#09c;}a:visited {color:#07a;}a:hover{background-color:white;} h1 {color:#333; font:24px/24px verdana, arial, helvetica, sans-serif; font-weight:900;}h2 {color:#333; font:12px verdana, arial, helvetica, sans-serif; font-weight:700; margin:18px 0px 3px 0px;}h3 {color:#666; font-size:11px; font-weight:800; margin:6px 0px 3px 0px;}img {border-width:0px;}img.thumb {margin:10px 1px;}#Copyright {clear:both; padding:50px 0px 100px 0px; text-align:center; font-weight:800; color:#999;}#copyrightText {position:relative; left:-17px;}.first {margin-top:0px; padding-top:0px;}.boxed {border: 1px solid black ;}</style></head><body><h1 id="Header">Bot Will Accept Anything - The project where anything goes, as long as the code allows it </h1><div class="Content"><p align="center">Navigation<br />Main - <a href="/commits/">Recent Commits</a> - <a href="/stdout/">Standard Output</a> - <a href="/statistics/">Statistics</a></p><h1>What is it?</h1><p>A bot will automatically merge any PR on this repo that gets enough votes from the community. PRs can contain anything, even changes to the bot\'s voting code.</p><h1>Where can I find it?</h1><p>You can find the bot and it\'s code in it\'s <a href="https://github.com/' + config.user + '/' + config.repo + '">GitHub Repository</a>.<h1>Where can I find more information?</h1><p>You can find more information in the <a href="https://github.com/' + config.user + '/' + config.repo + '/blob/master/README.md">README</a> file.</p></div><center><iframe src="https://ghbtns.com/github-btn.html?user=' + config.user + '&repo=' + config.repo + '&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></center></body></html>');
        });

        app.get('/commits', function (req, res) {
            var repo = git(__dirname);
            repo.commits(function (err, commits) {
                var commitLog = commits.map(function (commit) {
                    return '<li>' +
                        sanitizeAllHtml(commit.author.name + ' added ' + commit.id) +
                        "<br />" +
                        sanitizeAllHtml(commit.message).replace("\n", '<br />') +
                        '</li><br />';
                });
                var response = '<!DOCTYPE html><html><head><link rel="icon" type="image/ico" href="https://github.com/' + config.user + '/' + config.repo + '/blob/master/data/favicon.ico?raw=true"><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Bot Will Accept Anything</title><meta name="author" content="GitHub Commitors"><style type="text/css" media="all">div#one{width: 50%; float: left;} div#two{margin-left: 50%;}body {margin:0px; padding:0px; background-repeat:no-repeat; background-position:top right; background-color:white; color:black;}#Header {margin:85px 100px 0px 100px; padding:0px;}.Content {margin:0px 100px 50px; padding:20px; color:black; background-color:#eee; border:1px dashed black;}p {font-size:11px; line-height:20px; font-family:verdana, arial, helvetica, sans-serif; margin:0px 0px 12px 0px;}#Content>p {margin:0px;}#Content>p+p {text-indent:30px;}a {color:#09C; font-size:11px; text-decoration:none; font-weight:600; font-family:verdana, arial, helvetica, sans-serif;}a:link {color:#09c;}a:visited {color:#07a;}a:hover{background-color:white;} h1 {color:#333; font:24px/24px verdana, arial, helvetica, sans-serif; font-weight:900;}h2 {color:#333; font:12px verdana, arial, helvetica, sans-serif; font-weight:700; margin:18px 0px 3px 0px;}h3 {color:#666; font-size:11px; font-weight:800; margin:6px 0px 3px 0px;}img {border-width:0px;}img.thumb {margin:10px 1px;}#Copyright {clear:both; padding:50px 0px 100px 0px; text-align:center; font-weight:800; color:#999;}#copyrightText {position:relative; left:-17px;}.first {margin-top:0px; padding-top:0px;}.boxed {border: 1px solid black ;}</style></head><body><h1 id="Header">Bot Will Accept Anything - The project where anything goes, as long as the code allows it </h1><div class="Content"><p align="center">Navigation<br /><a href="/">Main</a> - Recent Commits - <a href="/stdout/">Standard Output</a> - <a href="/statistics/">Statistics</a></p>' +
                    '<div id="one"><p align="center">Last 10 commits:</p><br/><ul style="display: inline-block">';
                response += commitLog.join('') + '</ul></div><center><iframe src="https://ghbtns.com/github-btn.html?user=' + config.user + '&repo=' + config.repo + '&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></center></body></html>';
                res.send(response);
            });
        });

        app.get('/stdout', function (req, res) {
            var response = '<!DOCTYPE html><html><head><link rel="icon" type="image/ico" href="https://github.com/' + config.user + '/' + config.repo + '/blob/master/data/favicon.ico?raw=true"><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Bot Will Accept Anything</title><meta name="author" content="GitHub Commitors"><style type="text/css" media="all">body {margin:0px; padding:0px; background-repeat:no-repeat; background-position:top right; background-color:white; color:black;}#Header {margin:85px 100px 0px 100px; padding:0px;}.Content {margin:0px 100px 50px; padding:20px; color:black; background-color:#eee; border:1px dashed black;}p {font-size:11px; line-height:20px; font-family:verdana, arial, helvetica, sans-serif; margin:0px 0px 12px 0px;}#Content>p {margin:0px;}#Content>p+p {text-indent:30px;}a {color:#09C; font-size:11px; text-decoration:none; font-weight:600; font-family:verdana, arial, helvetica, sans-serif;}a:link {color:#09c;}a:visited {color:#07a;}a:hover{background-color:white;} h1 {color:#333; font:24px/24px verdana, arial, helvetica, sans-serif; font-weight:900;}h2 {color:#333; font:12px verdana, arial, helvetica, sans-serif; font-weight:700; margin:18px 0px 3px 0px;}h3 {color:#666; font-size:11px; font-weight:800; margin:6px 0px 3px 0px;}img {border-width:0px;}img.thumb {margin:10px 1px;}#Copyright {clear:both; padding:50px 0px 100px 0px; text-align:center; font-weight:800; color:#999;}#copyrightText {position:relative; left:-17px;}.first {margin-top:0px; padding-top:0px;}.boxed {border: 1px solid black ;}</style></head><body><h1 id="Header">Bot Will Accept Anything - The project where anything goes, as long as the code allows it </h1><div class="Content"><p align="center">Navigation<br /><a href="/">Main</a> - <a href="/commits/">Recent Commits</a> - Standard Output - <a href="/statistics/">Statistics</a></p>' +
                '<ul style="display: inline-block"><li>';
            response += stdoutLog.join('</li><li>') + '</li></ul></div>\<center><iframe src="https://ghbtns.com/github-btn.html?user=' + config.user + '&repo=' + config.repo + '&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></center></body></html>';
            res.send(response);
        });
        app.use(favicon(__dirname + '/../data/favicon.ico'));

        function signGitHubWebhookBlob(key, blob) {
            return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex');
        }

        /**
         * Display a message if the webhooks are operational.
         */
        app.get('/statistics/', function (req, res) {
            if (typeof config.githubAuth.webhookSecret === 'undefined') {
                res.send('<!DOCTYPE html><html><head><link rel="icon" type="image/ico" href="https://github.com/' + config.user + '/' + config.repo + '/blob/master/data/favicon.ico?raw=true"><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Bot Will Accept Anything</title><meta name="author" content="GitHub Commitors"><style type="text/css" media="all">body {margin:0px; padding:0px; background-repeat:no-repeat; background-position:top right; background-color:white; color:black;}#Header {margin:85px 100px 0px 100px; padding:0px;}.Content {margin:0px 100px 50px; padding:20px; color:black; background-color:#eee; border:1px dashed black;}p {font-size:11px; line-height:20px; font-family:verdana, arial, helvetica, sans-serif; margin:0px 0px 12px 0px;}#Content>p {margin:0px;}#Content>p+p {text-indent:30px;}a {color:#09C; font-size:11px; text-decoration:none; font-weight:600; font-family:verdana, arial, helvetica, sans-serif;}a:link {color:#09c;}a:visited {color:#07a;}a:hover{background-color:white;} h1 {color:#333; font:24px/24px verdana, arial, helvetica, sans-serif; font-weight:900;}h2 {color:#333; font:12px verdana, arial, helvetica, sans-serif; font-weight:700; margin:18px 0px 3px 0px;}h3 {color:#666; font-size:11px; font-weight:800; margin:6px 0px 3px 0px;}img {border-width:0px;}img.thumb {margin:10px 1px;}#Copyright {clear:both; padding:50px 0px 100px 0px; text-align:center; font-weight:800; color:#999;}#copyrightText {position:relative; left:-17px;}.first {margin-top:0px; padding-top:0px;}.boxed {border: 1px solid black ;}</style></head><body><h1 id="Header">Bot Will Accept Anything - The project where anything goes, as long as the code allows it </h1><div class="Content"><p align="center">Navigation<br /><a href="/">Main</a> - <a href="/commits/">Recent Commits</a> - <a href="/stdout/">Standard Output</a> - Statistics</p><center><table><tr><td>Webhook Status:</td><td>Disabled</td></tr><tr><td>Operating System:</td><td>' + os.type() + ' ' + os.release() + '</td></tr><tr><td>System Uptime:</td><td>' + os.uptime() + ' Seconds</td></tr><tr><td>System Name:</td><td>' + os.hostname() + '</td></tr></table></center></p></div><center><iframe src="https://ghbtns.com/github-btn.html?user=' + config.user + '&repo=' + config.repo + '&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></center></body></html>');
            } else {
                res.send('<!DOCTYPE html><html><head><link rel="icon" type="image/ico" href="https://github.com/' + config.user + '/' + config.repo + '/blob/master/data/favicon.ico?raw=true"><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Bot Will Accept Anything</title><meta name="author" content="GitHub Commitors"><style type="text/css" media="all">body {margin:0px; padding:0px; background-repeat:no-repeat; background-position:top right; background-color:white; color:black;}#Header {margin:85px 100px 0px 100px; padding:0px;}.Content {margin:0px 100px 50px; padding:20px; color:black; background-color:#eee; border:1px dashed black;}p {font-size:11px; line-height:20px; font-family:verdana, arial, helvetica, sans-serif; margin:0px 0px 12px 0px;}#Content>p {margin:0px;}#Content>p+p {text-indent:30px;}a {color:#09C; font-size:11px; text-decoration:none; font-weight:600; font-family:verdana, arial, helvetica, sans-serif;}a:link {color:#09c;}a:visited {color:#07a;}a:hover{background-color:white;} h1 {color:#333; font:24px/24px verdana, arial, helvetica, sans-serif; font-weight:900;}h2 {color:#333; font:12px verdana, arial, helvetica, sans-serif; font-weight:700; margin:18px 0px 3px 0px;}h3 {color:#666; font-size:11px; font-weight:800; margin:6px 0px 3px 0px;}img {border-width:0px;}img.thumb {margin:10px 1px;}#Copyright {clear:both; padding:50px 0px 100px 0px; text-align:center; font-weight:800; color:#999;}#copyrightText {position:relative; left:-17px;}.first {margin-top:0px; padding-top:0px;}.boxed {border: 1px solid black ;}</style></head><body><h1 id="Header">Bot Will Accept Anything - The project where anything goes, as long as the code allows it </h1><div class="Content"><p align="center">Navigation<br /><a href="/">Main</a> - <a href="/commits/">Recent Commits</a> - <a href="/stdout/">Standard Output</a> - Statistics</p><center><table><tr><td>Webhook Status:</td><td>Enabled</td></tr><tr><td>Operating System:</td><td>' + os.type() + ' ' + os.release() + '</td></tr><tr><td>System Uptime:</td><td>' + os.uptime() + ' Seconds</td></tr><tr><td>System Name:</td><td>' + os.hostname() + '</td></tr></table></center></p></div><center><iframe src="https://ghbtns.com/github-btn.html?user=' + config.user + '&repo=' + config.repo + '&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></center></body></html>');
            }
        });

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

	app.get('/*', function (req, res) {
		res.send('<!DOCTYPE html><html><head><link rel="icon" type="image/ico" href="https://github.com/' + config.user + '/' + config.repo + '/blob/master/data/favicon.ico?raw=true"><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Bot Will Accept Anything</title><meta name="author" content="GitHub Commitors"><style type="text/css" media="all">body {margin:0px; padding:0px; background-repeat:no-repeat; background-position:top right; background-color:white; color:black;}#Header {margin:85px 100px 0px 100px; padding:0px;}.Content {margin:0px 100px 50px; padding:20px; color:black; background-color:#eee; border:1px dashed black;}p {font-size:11px; line-height:20px; font-family:verdana, arial, helvetica, sans-serif; margin:0px 0px 12px 0px;}#Content>p {margin:0px;}#Content>p+p {text-indent:30px;}a {color:#09C; font-size:11px; text-decoration:none; font-weight:600; font-family:verdana, arial, helvetica, sans-serif;}a:link {color:#09c;}a:visited {color:#07a;}a:hover{background-color:white;} h1 {color:#333; font:24px/24px verdana, arial, helvetica, sans-serif; font-weight:900;}h2 {color:#333; font:12px verdana, arial, helvetica, sans-serif; font-weight:700; margin:18px 0px 3px 0px;}h3 {color:#666; font-size:11px; font-weight:800; margin:6px 0px 3px 0px;}img {border-width:0px;}img.thumb {margin:10px 1px;}#Copyright {clear:both; padding:50px 0px 100px 0px; text-align:center; font-weight:800; color:#999;}#copyrightText {position:relative; left:-17px;}.first {margin-top:0px; padding-top:0px;}.boxed {border: 1px solid black ;}</style></head><body><h1 id="Header">Bot Will Accept Anything - The project where anything goes, as long as the code allows it </h1><div class="Content"><p align="center">Navigation<br /><a href="/">Main</a> - <a href="/commits/">Recent Commits</a> - <a href="/stdout/">Standard Output</a> - <a href="/statistics/">Statistics</a></p><center><h1>That\'s a 404.</h1><p>We don\'t know what happened, but this page cannot be found.<br /><a href="/">Return to Index Page</a></p></div><center><iframe src="https://ghbtns.com/github-btn.html?user=' + config.user + '&repo=' + config.repo + '&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></center></body></html>');
		res.status(404);
	});
    };
}());
