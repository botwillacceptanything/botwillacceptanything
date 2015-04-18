(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        './voting'
    ];

    define(deps, function(Voting) {
        module.exports = Voting;
    });
}());