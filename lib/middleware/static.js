(function() {
    var define = require('amdefine')(module);

    var deps = [
        'express',
        'fs',
        'path'
    ];

    define(deps, function(express, fs, path) {
        function StaticMiddleware(app) {
            var dirPath = path.join(__dirname, '/../../data')
            app.use(express.static(dirPath));
        }

        module.exports = StaticMiddleware;
    })
}());