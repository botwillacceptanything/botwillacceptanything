(function() {
    'use strict';

    var define = require('amdefine')(module);
    var config = require('../../config.js');

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
                        messages: commits,
                        config: config
                    };
                    res.render('commits', data);
                });
            });
        };

        module.exports = RouteCommits;
    });
}());
