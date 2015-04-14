(function () {
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
        './vault'
    ];

    define(deps, function (express, fs, os, path, util, config, Logger, Middleware, Routes, Vault) {
        Vault.read();

        module.exports = function (config) {
            var app = express();

            // Pass config to every view
            app.use(function (req, res, next) {
                res.locals = {
                    config: config
                };
                next();
            });

            Middleware(app).then(function () {
                return Routes(app);
            }).then(function() {
                var port = config.webserver.port || 3000;
                Logger.info('Starting webserver at port ' + port);
                var server = app.listen(port);
            }, function(err) {
                Logger.error(err);
                Logger.error(err.stack);
            });

            /*

             //*/
        };
    });
}());
