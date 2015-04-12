(function () {
    'use strict';

    var define = require('amdefine')(module);
    var config = require('../../config.js');

    var deps = [];

    define(deps, function () {
        function RouteIndex(app) {
            app.get('/', function (req, res) {
                res.render('index');
            });
        };

        module.exports = RouteIndex;
    });
}());