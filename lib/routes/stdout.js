(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'intercept-stdout',
        'fs',
        'path',

        '../logger',
        '../../config'
    ];

    define(deps, function(interceptStdout, fs, path, Logger, config) {
        // Record a log of all stdout.
        var stdoutLog = [];
        var unhookStdout = interceptStdout(function (message) {
            // There is a bug in intercept-stdout that double-prints console.error
            // messages. This will ignore the incorrectly formatted one.
            if (message.indexOf("[ '[ERROR]") === 0) {
                return;
            }
            stdoutLog.push(message);
        });

        function RouteStdout(app) {
            app.get('/stdout', function (req, res) {
                fs.readFile(path.join(__dirname, '/../../tmp/access.log'), function (err, access) {
                  if (err) {
                    Logger.error(err);
                    Logger.error(err.stack);
                  }
                  var data = {
                      messages: stdoutLog,
                      access: access,
                  };
                  res.render('stdout', data);
                });
            });
        }

        module.exports = RouteStdout;
    });
}());
