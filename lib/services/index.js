(function() {
    'use strict';

    var define = require('amdefine')(module);
    
    var deps = [
        'deferred',
        'fs',
        'path',

        '../../config',
        '../logger',

    ];

    define(deps, function(deferred, fs, path, config, Logger) {
        module.exports = function(app) {
            var d = deferred();

            Logger.log('Initializing services.');

            var self = this;
            fs.readdir(__dirname, function (err, files) {
                if(err) {
                    return d.reject(err);
                }

                for (var i in files) {
                    var file = files[i];

                    if(file == 'index.js') {
                        continue;
                    }

                    var filePath = path.join(__dirname, file);
                    Logger.info('Loading ' + filePath);
                    var service = require(filePath);
                    service(app);
                }

                return d.resolve(self);
            });

            return d.promise();
        }
    });
}());
