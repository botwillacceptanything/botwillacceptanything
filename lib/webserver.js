(function () {
    var define = require('amdefine')(module);

    var deps = [
        'express',
        'fs',
        'os',
        'path',
        'util',

        './logger',
        './middleware',
        './routes',
        './vault'
    ];

    define(deps, function(express, fs, os, path, util, Logger, Middleware, Routes, Vault) {
        Vault.read();

        module.exports = function (config, events) {
            var app = express();

            Middleware(app).then(function() {
                return Routes(app);
            }).then(function() {
                var server = app.listen(3000);
            }, function(err) {
                Logger.error(err);
            });

            /*

             //*/
        };
    });
}());
