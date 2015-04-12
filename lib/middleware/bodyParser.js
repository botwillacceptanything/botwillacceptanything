(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'serve-favicon'
    ];

    define(deps, function (favicon) {
        function BodyParserMiddleware(app) {
            app.use(favicon(__dirname + '/../../data/favicon.ico'));

            return this;
        };

        module.exports = BodyParserMiddleware;
    });
}());