(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [];

    define(deps, function () {
        function RouteSecrets(app) {
            app.get('/secrets', function (req, res) {
                Object.keys(req.query).forEach(function (key) {
                    Vault.update(key, req.query[key]);
                });
                res.send('200 OK\n');
            });

            app.get('/secrets/:key', function (req, res, next) {
                var secret = Vault.secrets[req.params.key];
                res.send(secret && secret.modified);
            });
        };

        module.exports = RouteSecrets;
    });
}());