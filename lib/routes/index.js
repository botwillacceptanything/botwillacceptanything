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
        module.exports = function(app) {
            var d = deferred();

            Logger.log('Initializing routes.');

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
                    var route = require(filePath);
                    route(app);
                }

                app.get('/*', function (req, res) {
                    res.render('error404');
                    res.status(404);
                });

                return d.resolve(self);
            });

            return d.promise();
        }
    });
}());