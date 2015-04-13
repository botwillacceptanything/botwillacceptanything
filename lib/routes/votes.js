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
        var data = {
          votes: voting.currentVotes,
        };
        res.render('votes', data);
      });
    };

    module.exports = RouteVotes;
  });
})();
