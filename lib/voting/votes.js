(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'lodash',

    '../events',
  ];

  define(deps, function (_, events) {
    var VOTE_POSITIVE = ':+1:';
    var VOTE_NEGATIVE = ':-1:';
    var VOTE_MONKEY = [':monkey:', ':monkey_face:', ':hear_no_evil:',':see_no_evil:',':speak_no_evil:'];

    function percent(n) {
      return Math.floor(n * 1000) / 10;
    }

    function noop(err) {
      if (err) {
        console.error(err);
        console.error(err.stack);
      }
    }



    var VoteController = function VoteController(repo, votingConfig, starGazers, votesPerPR) {
      this.repo = repo;
      this.votingConfig = votingConfig;
      this.starGazers = starGazers;
      this.votesPerPR = votesPerPR;
    };

    /**
     * Tally up the votes on a PR, and monitor which users are stargazers.
     */
    VoteController.prototype.tallyVotes = function tallyVotes(pr) {
      var self = this;

      var tally = pr.comments.reduce(function (result, comment) {
        var user = comment.user.login,
          body = comment.body,
          voteCast = self.calculateUserVote(body);

        // People that don't star the repo cannot vote.
        if (!self.starGazers[user]) {
          if (result.nonStarGazers.indexOf(user) === -1) {
            result.nonStarGazers.push(user);
          }

          if (voteCast !== VOTE_MONKEY && voteCast !== null) {
            // This comment has not yet been marked as a monkey, but should be.
            // The user is not a stargazer, but has made a vote-style comment.
            // Edit the comment with a monkey warning appended to the end.
            gh.issues.editComment({
              user: self.repo.user,
              repo: self.repo.repo,
              id: comment.id,
              body: nonStarGazerComment(voteCast, body, user)
            }, noop);
          }
          return result;
        }

        // Only record votes that are explicitly
        // positive, or negative.
        // Monkeys and votes that go both ways
        // do not record a result.
        if (voteCast === VOTE_POSITIVE) {
          result.votes[user] = true;
        }

        if (voteCast === VOTE_NEGATIVE) {
          result.votes[user] = false;
        }

        return result;
      }, {
        votes: {},
        nonStarGazers: [],
      });

      // Add the PR author as a positive vote by default.
      if (!(pr.user.login in tally.votes)) {
        tally.votes[pr.user.login] = true;
      }

      var tallySpread = Object.keys(tally.votes).reduce(function (result, user) {
        // Increment the positive/negative counters.
        if (tally.votes[user]) {
          result.positive++;
        } else {
          result.negative++;
        }

        result.total++;
        return result;
      }, {
        positive: 0,
        negative: 0,
        total: 0
      });

      tallySpread.percentPositive = percent(tallySpread.positive / tallySpread.total);
      tallySpread.percentNegative = percent(tallySpread.negative / tallySpread.total);

      _.merge(tally, tallySpread);

      // Store this so that we can eventually make a votes webserver endpoint.
      this.votesPerPR[pr.number] = { pr: pr, votes: tally };
      events.emit('bot.pull_request.votes', pr, tally);

      return tally;
    }

    /**
     * Check the text of a comment, and determine what vote was cast.
     */
    VoteController.prototype.calculateUserVote = function calculateUserVote(text) {
      var positive = this.isPositive(text),
        negative = this.isNegative(text),
        monkey = this.isMonkey(text);

      if (monkey) {
        return VOTE_MONKEY;
      }

      // If the user has voted positive and negative, or hasn't voted, ignore it.
      if (positive && negative) {
        return null;
      }
      if (!positive && !negative) {
        return null;
      }

      // If positive is true, its positive. If its false, they voted negative.
      if (positive) {
        return VOTE_POSITIVE;
      }

      return VOTE_NEGATIVE;
    }

    // Returns true if the text contains a positive vote
    VoteController.prototype.isPositive = function isPositive (text) {
      return (text.indexOf(VOTE_POSITIVE) !== -1);
    }

    // Returns true if the text contains a negative vote
    VoteController.prototype.isNegative = function isNegative (text) {
      return (text.indexOf(VOTE_NEGATIVE) !== -1);
    }

    // Returns true if the text is a monkey vote.
    VoteController.prototype.isMonkey = function isMonkey (text) {
      // VOTE_MONKEY is an array of monkey vote keys.
      // If any of those keys appears in the text, the
      // vote is a monkey.
      return VOTE_MONKEY.some(function (monkey) {
        return (text.indexOf(monkey) !== -1);
      });
    }


    VoteController.prototype.doesVotePass = function doesVotePass(positive, negative) {
      return (positive / (positive + negative)) > this.votingConfig.supermajority;
    };

    module.exports = VoteController;
  });
}());
