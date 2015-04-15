(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [];

    define(deps, function () {

        // All names listed here should follow a simple camel case pattern.
        // E.g. "Voting Underway" label should be accessible via the 'votingUnderway' property.
        // Similarly, "Some crazy L4b3l" should be accessible via the 'someCrazyL4b3l' property.
        module.exports = {
            names: {
                votingUnderway: 'Voting Underway',
                rejected: 'Rejected',
                merged: 'Merged'
            },
            asArray: function () {
                return [
                    { name: this.names.votingUnderway, color: '8AEBC9' },
                    { name: this.names.rejected, color: 'FF6333' },
                    { name: this.names.merged, color: '88C451' }
                ];
            }
        };
    });
}());
