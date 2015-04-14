(function() {
    var _ = require('lodash');

    var sentiment = require('sentiment');

    var template = require('./template');
    var config = require('../config.js');
    var gh = require('./github.js');
    var events = require('./events.js');

// voting settings
    var PERIOD = 15; // time for the vote to be open, in minutes
    var PERIOD_JITTER = 0.2; // fraction of period that is random
    var MIN_VOTES = 8; // minimum number of votes for a decision to be made
    var REQUIRED_SUPERMAJORITY = 0.65;
    var MINUTE = 60 * 1000; // (one minute in ms)
    var POLL_INTERVAL = MINUTE * 3; // how often to check the open PRs (in seconds)

    var decideVoteResult = function (yeas, nays) {
        // vote passes if yeas > nays
        return (yeas / (yeas + nays)) > REQUIRED_SUPERMAJORITY;
    };

    var voteStartedComment = template.render('voting/voteStarted.md', {
        jitter: PERIOD_JITTER * 100 / 2,
        majority: REQUIRED_SUPERMAJORITY * 100,
        period: PERIOD,
        min_votes: MIN_VOTES
    });

    var modifiedWarning = template.render('voting/modifiedWarning.md');
    var couldntMergeWarning = template.render('voting/couldntMergeWarning.md');

    var kitten = '';

    var votePassComment = template.render('voting/votePassComment.md');
    var voteFailComment = template.render('voting/voteFailComment.md');

// We add a jitter to the PERIOD after the comment has been created, "to avoid people timing their votes".
// More precisely, there is an incentive in the previous constant-period system to send in the vote at the last second,
// because otherwise people can "react" to it by voting in the opposite direction (without sock-puppet accounts).
    PERIOD = PERIOD * (1 + (Math.random() - 0.5) * PERIOD_JITTER);

    var voteEndComment = function (pass, yea, nay, nonStarGazers) {
        var total = yea + nay;
        var yeaPercent = percent(yea / total);
        var nayPercent = percent(nay / total);

        var resp = '#### ' + (pass ? (kitten + votePassComment) : voteFailComment) + '\n\n' +
            '----\n' +
            '**Tallies:**\n' +
            ':+1:: ' + yea + ' (' + yeaPercent + '%) \n' +
            ':-1:: ' + nay + ' (' + nayPercent + '%)';
        if (nonStarGazers.length > 0) {
            resp += "\n\n";
            resp += "These users aren't stargazers, so their votes were not counted: \n";
            nonStarGazers.forEach(function (user) {
                resp += " * @" + user + "\n";
            });
        }
        return resp;
    };

    var votesPerPR = {};
    var cachedStarGazers = {};
    var cachedPRs = {};

    function percent(n) {
        return Math.floor(n * 1000) / 10;
    }

    function noop(err) {
        if (err) { console.error(err); }
    }


    // get a random kitten to be used by this instance of the bot
    var options = {
        hostname: 'thecatapi.com',
        port: 80,
        path: '/api/images/get?format=html',
        method: 'POST'
    };
    var req = require('http').request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            kitten += chunk;
        });
    });
    req.write('');
    req.end();

    // an index of PRs we have posted a 'vote started' comment on
    var started = {};

    // handles an open PR
    function handlePR(pr) {
        // Don't act on closed PRs
        if (pr.state === 'closed') {
            return console.log('Update triggered on closed PR #' + pr.number);
        }

        // if there is no 'vote started' comment, post one
        if (!started[pr.number]) {
            postVoteStarted(pr);
        }

        // TODO: instead of closing PRs that get changed, just post a warning that
        //       votes have been reset, and only count votes that happen after the
        //       last change
        assertNotModified(pr, function () {
            // if the age of the PR is >= the voting period, count the votes
            var age = Date.now() - new Date(pr.created_at).getTime();

            if (age / MINUTE >= PERIOD) {
                processPR(pr);
            }
        });
    }

    // posts a comment explaining that the vote has started
    // (if one isn't already posted)
    function postVoteStarted(pr) {
        getVoteStartedComment(pr, function (err, comment) {
            if (err) { return console.error('error in postVoteStarted:', err); }
            if (comment) {
                // we already posted the comment
                started[pr.number] = true;
                return;
            }

            gh.issues.createComment({
                user: config.user,
                repo: config.repo,
                number: pr.number,
                body: voteStartedComment + " " + pr.head.sha

            }, function (err) {
                if (err) { return console.error('error in postVoteStarted:', err); }

                events.emit('bot.pull_request.vote_started', pr);
                started[pr.number] = true;
                console.log('Posted a "vote started" comment for PR #' + pr.number);

                // determine whether I like this PR or not
                var score = sentiment(pr.title + ' ' + pr.body).score;
                if (score > 1) {
                    // I like this PR, let's vote for it!
                    gh.issues.createComment({
                        user: config.user,
                        repo: config.repo,
                        number: pr.number,
                        body: ':+1:'
                    });
                } else if (score < -1) {
                    // Ugh, this PR sucks, boooo!
                    gh.issues.createComment({
                        user: config.user,
                        repo: config.repo,
                        number: pr.number,
                        body: ':-1:'
                    });
                } // otherwise it's meh, so I don't care
            });
        });
    }

    // checks for a "vote started" comment posted by ourself
    // returns the comment if found
    function getVoteStartedComment(pr, cb) {
        for (var i = 0; i < pr.comments.length; i++) {
            var postedByMe = pr.comments[i].user.login === config.user;
            var isVoteStarted = pr.comments[i].body.indexOf(voteStartedComment) === 0;
            if (postedByMe && isVoteStarted) {
                // comment was found
                return cb(null, pr.comments[i]);
            }
        }

        // comment wasn't found
        return cb(null, null);
    }

    // calls cb if the PR has not been committed to since the voting started,
    // otherwise displays an error
    function assertNotModified(pr, cb) {
        getVoteStartedComment(pr, function (err, comment) {
            if (err) { return console.error('error in assertNotModified:', err); }

            if (comment) {
                var originalHead = comment.body.substr(comment.body.lastIndexOf(' ') + 1);
                if (pr.head.sha !== originalHead) {
                    console.log('Posting a "modified PR" warning, and closing #' + pr.number);
                    return closePR(modifiedWarning, pr, noop);
                }
            }

            cb();
        });
    }

    // returns an object of all the people who have starred the repo, indexed by username
    function getStargazerIndex(cb) {
        getAllPages(gh.repos.getStargazers, function (err, stargazers) {
            if (err || !stargazers) {
                console.error('Error getting stargazers:', err);
                if (typeof cb === 'function') {
                    return cb(err, stargazers);
                }
                return;
            }

            var index = {};
            stargazers.forEach(function (stargazer) {
                index[stargazer.login] = true;
            });
            cachedStarGazers = index;
            if (typeof cb === 'function') {
                cb(stargazers);
            }
        });
    }

    setInterval(getStargazerIndex, POLL_INTERVAL);

    // returns all results of a paginated function
    function getAllPages(pr, f, cb, n, results) {
        // pr is optional
        if (typeof pr === 'function') {
            cb = f;
            f = pr;
            pr = null;
        }
        if (!results) { results = []; }
        if (!n) { n = 0; }

        f({
            user: config.user,
            repo: config.repo,
            number: pr ? pr.number : null,
            page: n,
            per_page: 100

        }, function (err, res) {
            if (err || !res) { return cb(err); }

            results = results.concat(res);

            // if we got to the end of the results, return them
            if (res.length < 100) {
                return cb(null, results);
            }

            // otherwise keep getting more pages recursively
            getAllPages(pr, f, cb, n + 1, results);
        });
    }

    // closes the PR. if `message` is provided, it will be posted as a comment
    function closePR(message, pr, cb) {
        // message is optional
        if (typeof pr === 'function') {
            cb = pr;
            pr = message;
            message = '';
        }

        // Flag the PR as closed pre-emptively to prevent multiple comments.
        cachedPRs[pr.number].state = 'closed';

        if (message) {
            gh.issues.createComment({
                user: config.user,
                repo: config.repo,
                number: pr.number,
                body: message
            }, noop);
        }

        gh.pullRequests.update({
            user: config.user,
            repo: config.repo,
            number: pr.number,
            state: 'closed',
            title: pr.title,
            body: pr.body

        }, function (err, res) {
            if (err) { return cb(err); }
            console.log('Closed PR #' + pr.number);
            return cb(null, res);
        });
    }

    // merges a PR into master. If it can't be merged, a warning is posted and the PR is closed.
    function mergePR(pr, cb) {
        gh.pullRequests.get({
            user: config.user,
            repo: config.repo,
            number: pr.number

        }, function (err, res) {
            if (err || !res) { return cb(err); }
            if (res.mergeable === false) {
                console.error('Attempted to merge PR #' + res.number +
                ' but it failed with a mergeable (' + res.mergeable +
                ') state of ' + res.mergeable_state);
                return closePR(couldntMergeWarning, pr, function () {
                    cb(new Error('Could not merge PR because the author of the PR is a smeghead.'));
                });
            } else if (res.mergeable === null) {
                console.error('Attempted to merge PR #' + res.number +
                ' but it was postponed with a mergeable (' +
                res.mergeable + ') state of ' + res.mergeable_state);
                // Try it again in 5 seconds if it failed with a "null" mergeable state.
                return setTimeout(function () {
                    mergePR(pr, cb);
                }, 5000);
            }

            // Flag the PR as closed pre-emptively to prevent multiple comments.
            cachedPRs[pr.number].state = 'closed';

            gh.pullRequests.merge({
                user: config.user,
                repo: config.repo,
                number: pr.number
            }, function (err, res) {
                cb(err, res);
            });
        });
    }

    /**
     * Fetch all PRs from GitHub, and then look up all of their comments.
     */
    function refreshAllPRs() {
        getAllPages(gh.pullRequests.getAll, function (err, prs) {
            if (err || !prs) {
                return console.error('Error getting Pull Requests.', err);
            }

            prs.map(function (pr) {
                pr.comments = [];
                cachedPRs[pr.number] = pr;
                refreshAllComments(pr, handlePR);
            });
        });
    }

    // Repoll all PRs every 30 minutes, just to be safe.
    setInterval(refreshAllPRs, MINUTE * 30);

    /**
     * Fetch all comments for a PR from GitHub.
     */
    function refreshAllComments(pr, cb) {
        getAllPages(pr, gh.issues.getComments, function (err, comments) {
            if (err || !comments) {
                return console.error('Error getting Comments.', err);
            }

            pr.comments = comments;
            if (typeof cb === 'function') {
                cb(pr);
            }
        });
    }

    /**
     * Tally all of the votes for a PR, and if conditions pass, merge or close it.
     */
    function processPR(pr) {
        var voteResults = tallyVotes(pr);
        // only make a decision if we have the minimum amount of votes
        if (voteResults.total < MIN_VOTES) { return; }

        // vote passes if yeas > nays
        var passes = decideVoteResult(voteResults.positive, voteResults.negative);

        gh.issues.createComment({
            user: config.user,
            repo: config.repo,
            number: pr.number,
            body: voteEndComment(passes, voteResults.positive, voteResults.negative, voteResults.nonStarGazers)
        }, noop);

        // Post in IRC
        if (passes) {
            mergePR(pr, noop);
        } else {
            closePR(pr, noop);
        }
    }

    /**
     * Tally up the votes on a PR, and monitor which users are stargazers.
     */
    function tallyVotes(pr) {
        var tally = pr.comments.reduce(function (result, comment) {
            var user = comment.user.login,
                body = comment.body;

            // Don't check comments from the config user.
            if (user === config.user) { return result; }
            // People that don't star the repo cannot vote.
            if (!cachedStarGazers[user]) {
                result.nonStarGazers.push(user);
                return result;
            }

            // Skip people who vote both ways.
            var voteCast = calculateUserVote(body);
            if (voteCast === null) {
                return result;
            }

            result.votes[user] = voteCast;

            return result;
        }, {
            votes: {},
            nonStarGazers: [],
        });

        // Add the PR author as a positive vote.
        tally.votes[pr.user.login] = true;

        // determine whether I like this PR or not (or don't care)
        var score = sentiment(pr.title + ' ' + pr.body).score;
        if (score > 1) {
            tally.votes[config.user] = true;
        } else if (score < -1) {
            tally.votes[config.user] = false;
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
        votesPerPR[pr.number] = { pr: pr, votes: tally };
        events.emit('bot.pull_request.votes', pr, tally);

        return tally;
    }

    /**
     * Check the text of a comment, and determine what vote was cast.
     */
    function calculateUserVote(text) {
        var positive = (text.indexOf(':+1:') !== -1),
            negative = (text.indexOf(':-1:') !== -1);

        // If the user has voted positive and negative, or hasn't voted, ignore it.
        if (positive && negative) {
            return null;
        }
        if (!positive && !negative) {
            return null;
        }

        // If positive is true, its positive. If its false, they voted negative.
        return positive;
    }

    /**
     * When a pull request is opened, add it to the cache and handle it.
     */
    events.on('github.pull_request.opened', function (data) {
        data.pull_request.comments = [];
        cachedPRs[data.number] = data.pull_request;
        handlePR(data.pull_request);
    });

    /**
     * When a pull request is closed, mark it so we don't process it again.
     */
    events.on('github.pull_request.closed', function (data) {
        var pr = cachedPRs[data.number];
        if (typeof pr !== 'undefined') {
            pr.state = 'closed';
        }
    });

    /**
     * When a comment is created, push it onto the PR, and handle the PR again.
     */
    events.on('github.comment.created', function (data) {
        var pr = cachedPRs[data.issue.number];
        if (typeof pr === 'undefined') {
            return console.error('Could not find PR', data.issue.number, 'when adding a comment');
        }
        pr.comments.push(data.comment);
        handlePR(pr);
    });
    
    var voting = {};

    /**
     * Initialize the voting system by polling stargazers, and then fetching PRs.
     */
    voting.initialize = function () {
        getStargazerIndex(refreshAllPRs);

        // If we're not set up for GitHub Webhooks, poll the server every interval.
        if (typeof config.githubAuth === 'undefined') {
            setInterval(refreshAllPRs, POLL_INTERVAL);
        }
    };

    voting.currentVotes = votesPerPR;
    voting.minVotes = MIN_VOTES;
    voting.period = PERIOD;
    voting.supermajority = REQUIRED_SUPERMAJORITY;

    module.exports = voting;
}());
