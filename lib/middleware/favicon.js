(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'serve-favicon'
    ];

    define(deps, function (favicon) {
        function FaviconMiddleware(app) {
            app.use(favicon(__dirname + '/../../data/favicon.ico'));

            return this;
        };

        module.exports = FaviconMiddleware;
    });
}());