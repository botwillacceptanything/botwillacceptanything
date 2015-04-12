(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'fs',
        'express-handlebars',
        'path'
    ];

    define(deps, function(fs, mustache, path) {
        function PublicViewsMiddleware(app) {
            var viewsDir = path.join(__dirname, '/../../data/views');

            app.set('views', viewsDir);

            app.engine('.hbs', mustache({
                defaultLayout: 'main',
                extname: '.hbs',
                layoutsDir: path.join(viewsDir, 'layouts')
            }));

            // set views engine
            app.set('view engine', '.hbs');

            return this;
        };

       module.exports = PublicViewsMiddleware;
    });
}());