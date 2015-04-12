(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'body-parser'
    ];

    define(deps, function (bodyParser) {
        function FaviconMiddleware(app) {
            // Load body parser first
            app.use(bodyParser.json());

            return this;
        };

        module.exports = FaviconMiddleware;
    });
}());