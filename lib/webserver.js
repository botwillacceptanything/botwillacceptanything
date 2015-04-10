var express = require('express');
var app = express();

var git = require('gift');
var sanitizeHtml = require('sanitize-html');

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
}
