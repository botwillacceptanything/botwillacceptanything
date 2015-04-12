(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        './logger'
    ];

    define(deps, function(Logger) {
        module.exports = Logger;
    });
}());