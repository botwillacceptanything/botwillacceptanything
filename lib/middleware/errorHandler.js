(function() {
    var define = require('amdefine')(module);

    var deps = [
        'errorhandler'
    ];

    define(deps, function(errorhandler) {
        function ErrorHandlerMiddleware(app) {
            // only use in development
            app.use(errorhandler({
                dumpExceptions: true,
                showStack: true
            }));

            return this;
        }

        module.exports = ErrorHandlerMiddleware;
    })
}());