(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'deferred',
        'fs',
        'path',

        '../logger'
    ];

    define(deps, function(deferred, fs, path, Logger) {
        module.exports = function () {
            var d = deferred();

            Logger.log('Initializing integrations.');

            var self = this;

            var readdir = deferred.promisify(fs.readdir);
            readdir(__dirname)
                .map(function (file) {
                    // Only load .js files in the current directory, do not recurse
                    // sub-directories, do not include index.js
                    if (file.match(/^.+\.js$/g) && file !== 'index.js') {
                        var filePath = path.join(__dirname, file);
                        Logger.info('Loading ' + filePath);
                        return require(filePath)();
                    }
                })
                .then(d.resolve, function (err) {
                    Logger.error(err);
                    Logger.error(err.stack);
                });

            return d.promise();
        }
    })
}());
