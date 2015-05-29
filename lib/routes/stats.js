(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'os',
        '../../config',
    ];

    define(deps, function (os, config) {
        function RouteStats(app) {
            app.get('/stats', function (req, res) {
                var tmpldata = {
                    layout: 'stats'
                }
                res.render('stats', tmpldata);
            });
        };

        module.exports = RouteStats;
    });
}());

