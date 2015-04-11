(function() {
    var bodyParser = require('body-parser');
    var express = require('express');
    var fs = require('fs');
    var favicon = require('serve-favicon');
    var os = require('os');
    var path = require('path');
    var util = require('util');

    var Vault = require('./vault.js');
    Vault.read();

    module.exports = function (config, events) {
        var app = express();

        var routesPath = path.join(__dirname, 'routes');
        fs.readdir(routesPath, function(err, files) {
            for(var i in files) {
                var file = files[i];

                var route = require(path.join(routesPath, file));
                route(app);
            }

            var server = app.listen(3000);
            app.use(bodyParser.json());
        });

        app.use(favicon(__dirname + '/../data/favicon.ico'));
    };
}());
