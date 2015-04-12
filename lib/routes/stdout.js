(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'intercept-stdout'
    ];

    define(deps, function(interceptStdout) {
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

                var data = {
                    messages: stdoutLog
                }
                res.render('stdout', data);
            });
        };

        module.exports = RouteStdout;
    });
}());