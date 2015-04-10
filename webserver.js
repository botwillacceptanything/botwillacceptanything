var express = require('express');
var app = express();

var git = require('gift');
var sanitizeHtml = require('sanitize-html');
var interceptStdout = require('intercept-stdout');

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

module.exports = function (config, gh) {
  var server = app.listen(3000);
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
}
