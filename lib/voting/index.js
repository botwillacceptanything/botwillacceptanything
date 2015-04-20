(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        './voting'
    ];

    define(deps, function(Voting) {
        var voting = {
          instances: [],
        };

        voting.setup = function (repo) {
          voting.instances.push(new Voting(repo));
        };

        module.exports = voting;
    });
}());
