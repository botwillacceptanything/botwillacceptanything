(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'gift',
        'fs',
        'path',

        '../shared',
        '../../config',
        '../logger',
    ];

    define(deps, function(git, fs, path, Shared, config, Logger) {
        function RouteCommits(app) {
            app.get('/commits', function (req, res) {
                var repo = git(__dirname);
                repo.commits(function (err, commits) {
                    var data = {
                        messages: commits
                    };
                    var authorsFile = path.join(__dirname, '../../data/authors.txt');
                    fs.readFile(authorsFile, { encoding: 'utf8' }, function (err, authors) {
                        if (err) {
                          Logger.error(err);
                          Logger.error(err.stack);
                          return;
                        }
                        // Split the authors on new lines
                        authors = authors.trim().split("\n")
                          // For each item, return an object for ChartJS.
                          .map(function (line) {
                            // Match any characters that aren't whitespace.
                            line = line.match(/\S+/g);
                            // If no match was found, don't return anything.
                            if (line === null) { return; }
                            // Otherwise, return the correct values.
                            return {
                              value: line[0],
                              label: line[1],
                            };
                          })
                        //data.graph = authors;
                        data.graph = JSON.stringify(authors);
                        res.render('commits', data);
                    });
                });
            });
        };

        module.exports = RouteCommits;
    });
}());
