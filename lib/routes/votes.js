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
        var yeas;
        var nays;
        var voteMap = [];
        var voteMapSize = 10;
        for (yeas = 0; yeas < voteMapSize; yeas += 1) {
          voteMap.push([]);
          for (nays = 0; nays < voteMapSize; nays += 1) {
            var mapMark;
            if (voting.canDecideVote(yeas,nays)) {
              if (voting.decideVoteResult(yeas,nays)) {
                mapMark = "W";
              } else {
                mapMark = "L";
              }
            } else {
              mapMark = "";
            }
            voteMap[voteMap.length-1].push(mapMark);
          }
        }
        var i;
        for (i = 0; i < voting.currentVotes.length; i += 1) {
          var vote = voting.currentVotes[i];
          var yeas = vote.votes.positive;
          var nays = vote.votes.negative;
          if (0 <= yeas && yeas < voteMapSize && 0 <= nays && nays < voteMapSize) {
            if (voteMap[yeas][nays] != "") {
              voteMap[yeas][nays] += ",";
            }
            voteMap[yeas][nays] += "#" + vote.pr.number;
          }
        }
        var data = {
          votes: voting.currentVotes,
          voteMap : voteMap,
        };
        res.render('votes', data);
      });
    };

    module.exports = RouteVotes;
  });
})();
