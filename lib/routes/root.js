(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        '../generatename'
    ];

    define(deps, function (GenerateName) {
        function RouteIndex(app) {
            app.get('/', function (req, res) {
                var data = {
                    name : GenerateName()
                };
                res.render('index', data);
            });
        };

        module.exports = RouteIndex;
    });
}());
