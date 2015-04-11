(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'events'
    ];

    define(deps, function(Events) {
        module.exports = new Events.EventEmitter();
    });
}());