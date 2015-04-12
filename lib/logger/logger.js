(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
       'deferred'
    ];

    define(deps, function(deferred) {
        var log = function(method, args) {
            if(method) {
                method(args);
            } else {
                console.log(args);
            }
        };

        function Logger() {
            return this;
        };

        Logger.debug = function(args) {
            log(console.debug, args);
        };

        Logger.error = function(args) {
            log(console.error, args);
        };

        Logger.info = function(args) {
            log(console.info, args);
        };

        Logger.log = function(args) {
            log(console.log, args);
        };

        Logger.warn = function(args) {
            log(console.warn, args);
        };

        module.exports = Logger;
    });
}());