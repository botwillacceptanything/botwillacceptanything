(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        './integrations'
    ];

    define(deps, function(Integrations) {
        module.export = Integrations;
    })
}());