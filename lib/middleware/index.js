(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
       'deferred',

        '../logger'
    ];

    define(deps, function(deferred, Logger) {
        module.exports = function() {
            Logger.log('Initializing middleware.');
            return deferred(this);
        }
    });
}());