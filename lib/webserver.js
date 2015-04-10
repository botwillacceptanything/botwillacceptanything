var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var app = express();

var git = require('gift');
var sanitizeHtml = require('sanitize-html');
var interceptStdout = require('intercept-stdout');
var crypto = require('crypto');

var util = require('util');

// Record a log of all stdout.
var stdoutLog = [];
var unhookStdout = interceptStdout(function (message) {
  // There is a bug in intercept-stdout that double-prints console.error
  // messages. This will ignore the incorrectly formatted one.
  if (message.indexOf("[ '[ERROR]") === 0) { return; }
  stdoutLog.push(message);
});

function sanitizeAllHtml(dirty) {
  return sanitizeHtml(dirty, { allowedTags: [] });
}

module.exports = function (config, events) {
  var server = app.listen(3000);
  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    var repo = git(__dirname)
    repo.commits(function (err, commits) {
      var commitLog = commits.map(function (commit) {
        return '<li>' +
            sanitizeAllHtml(commit.author.name + ' added ' + commit.id) +
            "<br />" +
            sanitizeAllHtml(commit.message).replace("\n", '<br />') +
          '</li>';
      });
      var response = 'Last 10 commits:<ul>';
      response += commitLog.join('') + '</ul>';
      res.send(response);
    });
  });

  app.get('/stdout', function (req, res) {
    var response = '<h1>Standard Output</h1><ul><li>';
    response += stdoutLog.join('</li><li>') + '</li></ul>';
    res.send(response);
  });
    app.use(favicon(__dirname + '/../data/favicon.ico'));

  function signGitHubWebhookBlob(key, blob) {
    return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex')
  }

  /**
   * Display a message if the webhooks are operational.
   */
  app.get('/webhook/github', function (req, res) {
    if (typeof config.githubAuth.webhookSecret === 'undefined') {
      res.send('Webhooks are disabled.');
    } else {
      res.send('Webhooks are enabled.');
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
}
