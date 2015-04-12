(function() {
    var define = require('amdefine')(module);

    var deps = [
        'fs',
        'morgan',
        'path'
    ];

    define(deps, function(fs, logger, path) {
        function LoggerMiddleware(app) {
            // Create logger
            app.use(logger('combined'));

            // create a write stream (in append mode)
            var logPath = path.join(__dirname, '/../../tmp/access.log');
            var accessLogStream = fs.createWriteStream(logPath, {
                flags: 'a'
            });

            app.use(logger('combined', {
                stream: accessLogStream
            }));

            return this;
        }

        module.exports = LoggerMiddleware;
    })
}());