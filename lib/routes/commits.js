(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'gift',
        '../shared',
        '../../config'
    ];

    define(deps, function(git, Shared, config) {
        function RouteCommits(app) {
            app.get('/commits', function (req, res) {
                var repo = git(__dirname);
                repo.commits(function (err, commits) {
                    var data = {
                        messages: commits
                    };
                    res.render('commits', data);
                });
            });
        };

        module.exports = RouteCommits;
    });
}());
