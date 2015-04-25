(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'request',

    '../template',
  ];

  define(deps, function (request, template) {
    var kitten = '';

    function percent(n) {
      return Math.floor(n * 1000) / 10;
    }

    module.exports = function (votingParams) {
      var templates = {
        votePassComment: template.render('voting/votePassComment.md'),
        voteFailComment: template.render('voting/voteFailComment.md'),
        modifiedWarning: template.render('voting/modifiedWarning.md'),
        couldntMergeWarning: template.render('voting/couldntMergeWarning.md'),
        voteStartedComment: template.render('voting/voteStarted.md', {
          period: votingParams.period,
          jitter: votingParams.period_jitter * 100 / 2,
          majority: votingParams.supermajority * 100,
          min_votes: votingParams.minVotes,
        }),
      };

      /**
       * Get a random kitten to be used by the bot.
       */
      templates.updateKittenImage = function updateKittenImage() {
        var self = this;

        request('https://thecatapi.com/api/images/get?format=html', function (err, resp, body) {
          if (err) {
            console.error(err);
            console.error(err.stack);
            return;
          }
          kitten = body;
        });
      };

      templates.voteEndComment = function (pass, yea, nay, nonStarGazers) {
        var total = yea + nay;
        var yeaPercent = percent(yea / total);
        var nayPercent = percent(nay / total);

        // Map nonStarGazer user names to an object list that's better
        // for Mustache template.
        var nonStarGazerMap = nonStarGazers.map(function (user, index) {
          return {
            name: user,
            first: (index === 0),
            last: (index === (nonStarGazers.length - 1)),
          };
        });

        var voteEndedData = {
          passFail: (pass ? (kitten + templates.votePassComment) : templates.voteFailComment),
          yea: yea,
          nay: nay,
          yeaPercent: yeaPercent,
          nayPercent: nayPercent,
          nonStarGazers: nonStarGazerMap,
        };

        templates.updateKittenImage();
        return template.render('voting/voteEnded.md', voteEndedData);
      };

      templates.nonStarGazerComment = function (voteCast, body, user) {
        return (template.render('voting/nonStarGazerVote.md', {
          user: user,
          body: body,
          vote: voteCast,
          stargazerRefreshInterval: votingParams.pollInterval,
        }));
      };


      if (process.env.BUILD_ENVIRONMENT !== 'test') {
        // Immediately fetch a new kitten image.
        templates.updateKittenImage();
      }

      return templates;
    };
  });
}());
