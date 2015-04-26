(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'express',
        'fs',
        'os',
        'path',
        'util',

        '../config',
        './logger',
        './middleware',
        './routes',
        './vault',
        './generatename'
    ];

    define(deps,
           function (express, fs, os, path, util, config,
                     logger, middleware, routes, vault, generateName) {
        vault.read();

        module.exports = function (config) {
            var app = express();
            app.enable('trust proxy'), 

            // Pass config to every view
            app.use(function (req, res, next) {
                res.locals = {
                    config: config,
                    name : generateName()
                };
                next();
            });

            middleware(app).then(function () {
                return routes(app);
            }).then(function() {
                var port = config.webserver.port || 3000;
                logger.info('Starting webserver at port ' + port);
                app.listen(port);
            }, function(err) {
                logger.error(err);
                logger.error(err.stack);
            });
        };
    });
}());
