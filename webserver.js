var express = require('express');
var app = express();

var git = require('gift');

module.exports = function (config, gh) {
  var server = app.listen(3000);
  app.get('/', function (req, res) {
    var repo = git(__dirname)
    repo.commits(function (err, commits) {
      var commitLog = commits.map(function (commit) {
        return '<li>' +
            commit.author.name + ' added ' + commit.id +
            "<br />" +
            commit.message.replace("\n", '<br />') +
          '</li>';
      });
      var response = 'Last 10 commits:<ul>';
      response += commitLog.join('') + '</ul>';
      res.send(response);
    });
  });
}
