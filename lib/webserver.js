(function () {
    var define = require('amdefine')(module);

    var deps = [
        'express',
        'express-dynamic-helpers-patch',
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

    define(deps, function(express, dynamicHelpers, fs, os, path, util, config, Logger, Middleware, Routes, Vault) {
        Vault.read();

        module.exports = function (config, events) {
            var app = express();

            // Pass config to every view
            dynamicHelpers(app);

            app.dynamicHelpers({
                config: config
            });

            Middleware(app).then(function() {
                return Routes(app);
            }).then(function() {
                var server = app.listen(3000);
            }, function(err) {
                Logger.error(err);
                Logger.error(err.stack);
            });

            /*

             //*/
        };
    });
}());
