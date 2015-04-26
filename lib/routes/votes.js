(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    '../events',
    '../voting',
  ];

  define(deps, function (events, voting) {
    function RouteVotes(app) {
      app.get('/votes', function (req, res) {
        var now = new Date();
        var secondsPastMidnight = now.getSeconds() + 60 *
            now.getMinutes() + 60 * 60 * now.getHours();
        var now_utc = new Date(now.getUTCFullYear(),
            now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(),
            now.getUTCSeconds());
        var secondsPastMidnightUTC = now_utc.getSeconds() + 60 *
            now_utc.getMinutes() + 60 * 60 * now_utc.getHours();
        var data = {
          repositories: voting.instances,
          now: now,
          secondsPastMidnight: secondsPastMidnight,
          now_utc: now_utc,
          secondsPastMidnightUTC: secondsPastMidnightUTC,
        };
        res.render('votes', data);
      });
    };

    module.exports = RouteVotes;
  });
})();
