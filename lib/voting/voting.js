(function() {
    var define = require('amdefine')(module);

    var deps = [
        'lodash',
        'sentiment',

        '../../config',
        '../events',
        '../github',
        './templates',
        './votes.js',
    ];

    define(deps, function(
        _,
        sentiment,

        config,
        events,
        gh,
        templates,
        VoteController
    ) {
      var MINUTE = 60 * 1000; // One minute in ms.

      function noop(err) {
        if (err) {
          console.error(err);
          console.error(err.stack);
        }
      }


      var Voting = function Voting(repo) {
        var self = this;

        this.starGazers = {};
        this.pullRequests = {};
        this.startedPRs = {};
        this.votesPerPR = {};

        this.repo = repo;
        this.votingConfig = repo.votingConfig;
        this.votingConfig.truePeriod =
          this.votingConfig.period * (1 + (Math.random() - 0.5) * this.votingConfig.period_jitter);
        this.votingConfig.guaranteedResult =
          Math.ceil(this.votingConfig.minVotes * this.votingConfig.supermajority);
        this.voteController = new VoteController(repo, this.votingConfig, this.starGazers, this.votesPerPR);
        this.templates = templates(this.votingConfig);

        // Only initialize the regular polling if the bot is not being tested.
        if (process.env.BUILD_ENVIRONMENT !== 'test') {
          this.initialize();
        }

        // Initialize our event handling.
        this.initializeEvents();
      };

      Voting.prototype.initialize = function initialize() {
        // Immediately update the stargazers, and fetch and process all PRs.
        this.updateStarGazers(this.refreshAllPRs.bind(this));

        // If we're not set up for GitHub Webhooks, poll the server every interval.
        if (typeof config.githubAuth === 'undefined') {
          setInterval(this.refreshAllPRs.bind(this), this.votingConfig.pollInterval * MINUTE);
        } else {
          // Repoll all PRs every 30 minutes, just to be safe.
          setInterval(this.refreshAllPRs.bind(this), 30 * MINUTE);
        }
        // Check the stargazers every interval.
        setInterval(this.updateStarGazers.bind(this), this.votingConfig.pollInterval * MINUTE);
      };

      Voting.prototype.initializeEvents = function initializeEvents() {
        var self = this;

        /**
         * When a pull request is opened, add it to the cache and handle it.
         */
        events.on('github.pull_request.opened', function (data) {
          // Don't process events for other repositories.
          if (data.repository.name !== self.repo.repo ||
              data.repository.owner.login !== self.repo.user) {
            return;
          }

          data.pull_request.comments = [];
          self.pullRequests[data.number] = data.pull_request;
          self.handlePR(data.pull_request);
        });

        /**
         * When a pull request is closed, mark it so we don't process it again.
         */
        events.on('github.pull_request.closed', function (data) {
          // Don't process events for other repositories.
          if (data.repository.name !== self.repo.repo ||
              data.repository.owner.login !== self.repo.user) {
            return;
          }

          // Remove this PR from votesPerPR so it no longer shows up on website.
          delete self.votesPerPR[data.number];

          var pr = self.pullRequests[data.number];
          if (typeof pr !== 'undefined') {
            pr.state = 'closed';
          }
        });

        /**
         * When a comment is created, push it onto the PR, and handle the PR again.
         */
        events.on('github.comment.created', function (data) {
          // Don't process events for other repositories.
          if (data.repository.name !== self.repo.repo ||
              data.repository.owner.login !== self.repo.user) {
            return;
          }

          var pr = self.pullRequests[data.issue.number];
          if (typeof pr === 'undefined') {
            return console.error('Could not find PR', data.issue.number, 'when adding a comment');
          }
          pr.comments.push(data.comment);
          self.handlePR(pr);
        });
      };

      /**
       * Update the StarGazer cache.
       */
      Voting.prototype.updateStarGazers = function updateStarGazers(cb) {
        var self = this;

        gh.getAllPages(this.repo, gh.repos.getStargazers, function (err, stargazers) {
          if (err || !stargazers) {
            console.error('Error getting stargazers:', err);
            if (typeof cb === 'function') {
              return cb(err, stargazers);
            }
            return;
          }

          var index = {};
          // Erase the existing stargazers.
          Object.keys(self.starGazers).forEach(function (stargazer) {
            delete self.starGazers[stargazer];
          });
          // Add in the updated list of stargazers.
          stargazers.forEach(function (stargazer) {
            self.starGazers[stargazer.login] = true;
          });
          if (typeof cb === 'function') {
            cb(stargazers);
          }
        });
      };

      /**
       * Fetch all PRs from GitHub, and then look up all of their comments.
       */
      Voting.prototype.refreshAllPRs = function refreshAllPRs() {
        var self = this;

        gh.getAllPages(this.repo, gh.pullRequests.getAll, function (err, prs) {
          if (err || !prs) {
            return console.error('Error getting Pull Requests.', err);
          }

          prs.map(function (pr) {
            pr.comments = [];
            self.pullRequests[pr.number] = pr;
            self.refreshAllComments(pr, self.handlePR.bind(self));
          });
        });
      };

      /**
       * Fetch all comments for a PR from GitHub.
       */
      Voting.prototype.refreshAllComments = function refreshAllComments(pr, cb) {
        var self = this;
        var prRequest = _.merge({}, this.repo, { number: pr.number });

        gh.getAllPages(prRequest, gh.issues.getComments, function (err, comments) {
          if (err || !comments) {
            return console.error('Error getting Comments.', err);
          }

          pr.comments = comments;
          if (typeof cb === 'function') {
            cb(pr);
          }
        });
      };

      Voting.prototype.handlePR = function handlePR(pr) {
        var self = this;

        // Don't act on closed PRs
        if (pr.state === 'closed') {
          return console.log('Update triggered on closed PR #' + pr.number);
        }

        // if there is no 'vote started' comment, post one
        if (!this.startedPRs[pr.number]) {
          this.postVoteStarted(pr);
        }

        // TODO: instead of closing PRs that get changed, just post a warning that
        //     votes have been reset, and only count votes that happen after the
        //     last change
        this.assertNotModified(pr, function () {
          self.processPR(pr);
        });
      };

      Voting.prototype.postVoteStarted = function postVoteStarted(pr) {
        var self = this;

        this.getVoteStartedComment(pr, function (err, comment) {
          if (err) { return console.error('error in postVoteStarted:', err); }
          if (comment) {
            // we already posted the comment
            self.startedPRs[pr.number] = true;
            return;
          }

          gh.issues.createComment({
            user: self.repo.user,
            repo: self.repo.repo,
            number: pr.number,
            body: self.templates.voteStartedComment + " " + pr.head.sha

          }, function (err) {
            if (err) { return console.error('error in postVoteStarted:', err); }

            events.emit('bot.pull_request.vote_started', pr);
            self.startedPRs[pr.number] = true;
            console.log('Posted a "vote started" comment for PR #' + pr.number);

            // determine whether I like this PR or not
            var score = sentiment(pr.title + ' ' + pr.body).score;
            if (score > 1) {
              // I like this PR, let's vote for it!
              gh.issues.createComment({
                user: self.repo.user,
                repo: self.repo.repo,
                number: pr.number,
                body: self.voteController.votePositive,
              });
            } else if (score < -1) {
              // Ugh, this PR sucks, boooo!
              gh.issues.createComment({
                user: self.repo.user,
                repo: self.repo.repo,
                number: pr.number,
                body: self.voteController.voteNegative,
              });
            } // otherwise it's meh, so I don't care
          });
        });
      };

      /**
       * Check for a "vote started" comment posted by ourself.
       *
       * @return (object|null)
       *   Return the comment if found, and null otherwise.
       */
      Voting.prototype.getVoteStartedComment  = function getVoteStartedComment(pr, cb) {
        for (var i = 0; i < pr.comments.length; i++) {
          var postedByMe = pr.comments[i].user.login === this.repo.user;
          var isVoteStarted = pr.comments[i].body.indexOf(this.templates.voteStartedComment) === 0;
          if (postedByMe && isVoteStarted) {
            // comment was found
            return cb(null, pr.comments[i]);
          }
        }

        // comment wasn't found
        return cb(null, null);
      };

      /**
       * If the PR has not been modified, call the cb, otherwise display an error.
       */
      Voting.prototype.assertNotModified = function assertNotModified(pr, cb) {
        var self = this;

        this.getVoteStartedComment(pr, function (err, comment) {
          if (err) { return console.error('error in assertNotModified:', err); }

          if (comment) {
            var originalHead = comment.body.substr(comment.body.lastIndexOf(' ') + 1);
            if (pr.head.sha !== originalHead) {
              console.log('Posting a "modified PR" warning, and closing #' + pr.number);
              return self.closePR(modifiedWarning, pr, noop);
            }
          }

          cb();
        });
      };

      /**
       * Tally all of the votes for a PR, and if conditions pass, merge or close it.
       */
      Voting.prototype.processPR = function processPR(pr, cb) {
        var self = this;

        if (typeof cb === 'undefined') { cb = noop; }

        var voteResults = this.voteController.tallyVotes(pr);

        // only make a decision if the minimum period has elapsed.
        var age = Date.now() - new Date(pr.created_at).getTime();
        if (age / MINUTE < this.votingConfig.truePeriod) { return cb(null, false); }

        var highestVote = Math.max(voteResults.positive, voteResults.negative);

        // only make a decision if we have the minimum amount of votes
        if (highestVote < this.votingConfig.guaranteedResult) { return cb(null, false); }

        // vote passes if yeas > nays
        var passes = this.voteController.doesVotePass(voteResults.positive, voteResults.negative);

        gh.issues.createComment({
          user: self.repo.user,
          repo: self.repo.repo,
          number: pr.number,
          body: this.templates.voteEndComment(passes, voteResults.positive, voteResults.negative, voteResults.nonStarGazers)
        }, noop);

        // Post in IRC
        if (passes) {
          this.mergePR(pr, cb);
        } else {
          this.closePR(pr, cb);
        }
      };

      // closes the PR. if `message` is provided, it will be posted as a comment
      Voting.prototype.closePR = function closePR(message, pr, cb) {
        var self = this;

        // message is optional
        if (typeof pr === 'function') {
          cb = pr;
          pr = message;
          message = '';
        }

        // Flag the PR as closed pre-emptively to prevent multiple comments.
        this.pullRequests[pr.number].state = 'closed';

        if (message) {
          gh.issues.createComment({
            user: self.repo.user,
            repo: self.repo.repo,
            number: pr.number,
            body: message
          }, noop);
        }

        gh.pullRequests.update({
          user: self.repo.user,
          repo: self.repo.repo,
          number: pr.number,
          state: 'closed',
          title: pr.title,
          body: pr.body

        }, function (err, res) {
          if (err) { return cb(err); }
          console.log('Closed PR #' + pr.number);
          return cb(null, res);
        });
      };

      // merges a PR into master. If it can't be merged, a warning is posted and the PR is closed.
      Voting.prototype.mergePR = function mergePR(pr, cb) {
        var self = this;

        gh.pullRequests.get({
          user: self.repo.user,
          repo: self.repo.repo,
          number: pr.number

        }, function (err, res) {
          if (err || !res) { return cb(err); }
          if (res.mergeable === false) {
            console.error('Attempted to merge PR #' + res.number +
            ' but it failed with a mergeable (' + res.mergeable +
            ') state of ' + res.mergeable_state);
            return self.closePR(self.templates.couldntMergeWarning, pr, function () {
              cb(new Error('Could not merge PR.'));
            });
          } else if (res.mergeable === null) {
            console.error('Attempted to merge PR #' + res.number +
            ' but it was postponed with a mergeable (' +
            res.mergeable + ') state of ' + res.mergeable_state);
            // Try it again in 5 seconds if it failed with a "null" mergeable state.
            return setTimeout(function () {
              self.mergePR(pr, cb);
            }, 5000);
          }

          // Flag the PR as closed pre-emptively to prevent multiple comments.
          self.pullRequests[pr.number].state = 'closed';

          gh.pullRequests.merge({
            user: self.repo.user,
            repo: self.repo.repo,
            number: pr.number
          }, cb);
        });
      };



      module.exports = Voting;
    });
}());
