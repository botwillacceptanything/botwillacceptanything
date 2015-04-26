(function () {
    'use strict';
    var params = {
      voting : {
        period: 15,
        period_jitter: 0.2,
        minVotes: 6,
        supermajority: 0.65,
        pollInterval : 3,
      },
    };

    module.exports = params;
}());
