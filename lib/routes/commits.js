(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'gift',
        '../shared'
    ];

    define(deps, function(git, Shared) {
        function RouteCommits(app) {
            app.get('/commits', function (req, res) {
                var repo = git(__dirname);
                repo.commits(function (err, commits) {
                    var commitLog = commits.map(function (commit) {
                        return '<li>' +
                            Shared.sanitizeAllHtml(commit.author.name + ' added ' + commit.id) +
                            "<br />" +
                            Shared.sanitizeAllHtml(commit.message).replace("\n", '<br />') +
                            '</li><br />';
                    });
                var response = '<!DOCTYPE html><html><head><link rel="icon" type="image/ico" href="https://github.com/' + config.user + '/' + config.repo + '/blob/master/data/favicon.ico?raw=true"><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><title>Bot Will Accept Anything</title><meta name="author" content="GitHub Commitors"><style type="text/css" media="all">body {margin:0px; padding:0px; background-repeat:no-repeat; background-position:top right; background-color:white; color:black;}#Header {margin:85px 100px 0px 100px; padding:0px;}.Content {margin:0px 100px 50px; padding:20px; color:black; background-color:#eee; border:1px dashed black;}p {font-size:11px; line-height:20px; font-family:verdana, arial, helvetica, sans-serif; margin:0px 0px 12px 0px;}#Content>p {margin:0px;}#Content>p+p {text-indent:30px;}a {color:#09C; font-size:11px; text-decoration:none; font-weight:600; font-family:verdana, arial, helvetica, sans-serif;}a:link {color:#09c;}a:visited {color:#07a;}a:hover{background-color:white;} h1 {color:#333; font:24px/24px verdana, arial, helvetica, sans-serif; font-weight:900;}h2 {color:#333; font:12px verdana, arial, helvetica, sans-serif; font-weight:700; margin:18px 0px 3px 0px;}h3 {color:#666; font-size:11px; font-weight:800; margin:6px 0px 3px 0px;}img {border-width:0px;}img.thumb {margin:10px 1px;}#Copyright {clear:both; padding:50px 0px 100px 0px; text-align:center; font-weight:800; color:#999;}#copyrightText {position:relative; left:-17px;}.first {margin-top:0px; padding-top:0px;}.boxed {border: 1px solid black ;}</style></head><body><h1 id="Header">Bot Will Accept Anything - The project where anything goes, as long as the code allows it </h1><div class="Content"><p align="center">Navigation<br /><a href="/">Main</a> - Recent Commits - <a href="/stdout/">Standard Output</a> - <a href="/statistics/">Statistics</a></p>' +
                    '<p align="center">Last 10 commits:</p><br/><ul style="display: inline-block">';
                response += commitLog.join('') + '</ul></div><center><iframe src="https://ghbtns.com/github-btn.html?user=' + config.user + '&repo=' + config.repo + '&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></center></body></html>';
                res.send(response);
                });
            });
        };

        module.exports = RouteCommits;
    });
}());
