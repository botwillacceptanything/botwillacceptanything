
var EventEmitter = require('events').EventEmitter;
var request = require('request');

// voting settings
var PERIOD = 30; // time for the vote to be open, in minutes
var PERIOD_JITTER = 0.2; // fraction of period that is random
var MIN_VOTES = 5; // minimum number of votes for a decision to be made
var REQUIRED_SUPERMAJORITY = 0.65;

var MINUTE = 60 * 1000; // (one minute in ms)

var decideVoteResult = function(yeas, nays) {
  // vote passes if yeas > nays
  return (yeas / (yeas + nays)) > REQUIRED_SUPERMAJORITY;
}

var voteStartedComment = '#### :ballot_box_with_check: Voting procedure reminder:\n' +
  'To cast a vote, post a comment containing `:+1:` (:+1:), or `:-1:` (:-1:).\n' +
  'Remember, you **must :star:star this repo for your vote to count.**\n\n' +
  'All comments within this discussion are searched for votes, regardless of the time of posting.\n' +
  'You can cast as many votes as you want, but only the last one will be counted.\n' +
  '(You may consider editing your comment instead of adding a new one.)\n' +
  'Comments containing both up- and down-votes are disregarded.\n' +
  'PR authors automatically count as a :+1: vote.\n\n' +
  'A decision will be made after this PR has been open for **'+PERIOD+'** ' +
  'minutes (plus/minus **' + (PERIOD_JITTER*100) + '** percent, to avoid people timing their votes), ' +
  'and at least **'+MIN_VOTES+'** votes have been made.\n' +
  'A supermajority of **' + (REQUIRED_SUPERMAJORITY * 100) + '%** is required for the vote to pass.\n\n' +
  '*NOTE: the PR will be closed if any new commits are added after:* ';

var modifiedWarning = '#### :warning: This PR has been modified and is now being closed.\n\n' +
  'To prevent people from sneaking in changes after votes have been made, pull ' +
  'requests can\'t be committed on after they have been opened. Feel free to ' +
  'open a new PR for the proposed changes to start another round of voting.';

var couldntMergeWarning = '#### :warning: Error: This PR could not be merged\n\n' +
  'The changes in this PR conflict with other changes, so we couldn\'t automatically merge it. ' +
  'You can fix the conflicts and submit the changes in a new PR to start the voting process again.'

var kitten = '';

var votePassComment = ':+1: The vote passed! This PR will now be merged into master.';
var voteFailComment = ':-1: The vote failed. This PR will now be closed. Why don\'t you try some ideas that don\'t suck next time, you incredible git?'


// We add a jitter to the PERIOD after the comment has been created, "to avoid people timing their votes".
// More precisely, there is an incentive in the previous constant-period system to send in the vote at the last second,
// because otherwise people can "react" to it by voting in the opposite direction (with our without sock-puppet accounts).
PERIOD = PERIOD * (1 + (Math.random() - 0.5) * PERIOD_JITTER)

var voteEndComment = function(pass, yea, nay, nonStarGazers) {
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
    nonStarGazers.forEach(function(user) {
      resp += " * @" + user + "\n";
    });
  }
  return resp;
}

function percent(n) { return Math.floor(n * 1000) / 10; }
function noop(err) {
  if(err) console.error(err);
}

// Export this module as a function
// (so we can pass it the config and Github client)
module.exports = function(config, gh, Twitter) {
  // the value returned by this module
  var voting = new EventEmitter();

  // an index of PRs we have posted a 'vote started' comment on
  var started = {};

  // get a random kitten to be used by this instance of the bot
  var options = {
    hostname: 'thecatapi.com',
    port: 80,
    path: '/api/images/get?format=html',
    method: 'POST'
  };
  var req = require('http').request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      kitten += chunk;
    });
  });
  req.write('');
  req.end();

  // handles an open PR
  function handlePR(pr) {
    // if there is no 'vote started' comment, post one
    if(!started[pr.number]) {
      postVoteStarted(pr);
    }

    // TODO: instead of closing PRs that get changed, just post a warning that
    //       votes have been reset, and only count votes that happen after the
    //       last change
    assertNotModified(pr, function() {
      // if the age of the PR is >= the voting period, count the votes
      var age = Date.now() - new Date(pr.created_at).getTime();

      if(age / MINUTE >= PERIOD) {
        countVotes(pr);
      }
    });
  }

  // posts a comment explaining that the vote has started
  // (if one isn't already posted)
  function postVoteStarted(pr) {
    getVoteStartedComment(pr, function(err, comment) {
      if(err) return console.error('error in postVoteStarted:', err);
      if(comment) {
        // we already posted the comment
        started[pr.number] = true;
        return;
      }

      gh.issues.createComment({
        user: config.user,
        repo: config.repo,
        number: pr.number,
        body: voteStartedComment + pr.head.sha

      }, function(err, res) {
        if(err) return console.error('error in postVoteStarted:', err);
        started[pr.number] = true;
        console.log('Posted a "vote started" comment for PR #' + pr.number);

        // Tweet vote started
        Twitter.postTweet('Vote started for PR #' + pr.number + ': https://github.com/botwillacceptanything/botwillacceptanything/pull/' + pr.number);
      });
    });
  }

  // checks for a "vote started" comment posted by ourself
  // returns the comment if found
  function getVoteStartedComment(pr, cb) {
    // TODO: check more than just the first page
    gh.issues.getComments({
      user: config.user,
      repo: config.repo,
      number: pr.number,
      per_page: 100

    }, function(err, comments) {
      if(err || !comments) return cb(err);

      for(var i = 0; i < comments.length; i++) {
        var postedByMe = comments[i].user.login === config.user;
        var isVoteStarted = comments[i].body.indexOf(voteStartedComment) === 0;
        if(postedByMe && isVoteStarted) {
          // comment was found
          return cb(null, comments[i]);
        }
      }

      // comment wasn't found
      return cb(null, null);
    });
  }

  // calls cb if the PR has not been committed to since the voting started,
  // otherwise displays an error
  function assertNotModified(pr, cb) {
    getVoteStartedComment(pr, function(err, comment) {
      if(err) return console.error('error in assertNotModified:', err);

      if(comment) {
        var originalHead = comment.body.substr(comment.body.lastIndexOf(' ')+1);
        if(pr.head.sha !== originalHead) {
          console.log('Posting a "modified PR" warning, and closing #' + pr.number);
          return closePR(modifiedWarning, pr, noop);
        }
      }

      cb();
    });
  }

  // counts the votes in the PR. if the minimum number of votes has been reached,
  // make the decision (merge the PR, or close it).
  function countVotes(pr) {
    console.log('Counting votes for PR #' + pr.number);

    // TODO: cache the stargazers list so we don't have to make a bunch of requests to check?
    // get the people who starred the repo so we can ignore votes from people who did not star it
    getStargazerIndex(function(err, stargazers) {
      if(err || !stargazers) return console.error('error in countVotes:', err);

      // get the comments so we can count the votes
      getAllPages(pr, gh.issues.getComments, function(err, comments) {
        if(err || !comments) return console.error('error in countVotes:', err);

        // index votes by username so we only count 1 vote per person
        var votes = {};
        // The author of the PR automatically counts as a vote.
        votes[pr.user.login] = true;

        var nonStarGazers = [];
        for(var i = 0; i < comments.length; i++) {
          var user = comments[i].user.login;
          var body = comments[i].body;

          if(user === config.user) continue; // ignore self
          if(!stargazers[user]) {
            nonStarGazers.push(user);
            continue; // ignore people who didn't star the repo
          }

          // Skip people who vote both ways.
          if(body.indexOf(':-1:') !== -1 && body.indexOf(':+1:') !== -1) continue;
          else if(body.indexOf(':-1:') !== -1) votes[user] = false;
          else if(body.indexOf(':+1:') !== -1) votes[user] = true;
        }

        // tally votes
        var yeas = 0, nays = 0;
        for(var user in votes) {
          if(votes[user]) yeas++;
          else nays++;
        }

        console.log('Yeas: ' + yeas + ', Nays: ' + nays);

        // only make a decision if we have the minimum amount of votes
        if(yeas + nays < MIN_VOTES) return;

        // vote passes if yeas > nays
        var passes = decideVoteResult(yeas, nays);

        gh.issues.createComment({
          user: config.user,
          repo: config.repo,
          number: pr.number,
          body: voteEndComment(passes, yeas, nays, nonStarGazers)
        }, noop);

        if(passes) {
          mergePR(pr, noop);
        } else {
          closePR(pr, noop);
        }
      });
    });
  }

  // returns an object of all the people who have starred the repo, indexed by username
  function getStargazerIndex(cb) {
    getAllPages(gh.repos.getStargazers, function(err, stargazers) {
      if(err || !stargazers) return cb(err);

      var index = {};
      stargazers.forEach(function(stargazer) {
        index[stargazer.login] = true;
      });
      cb(null, index);
    });
  }

  // returns all results of a paginated function
  function getAllPages(pr, f, cb, n, results) {
    // pr is optional
    if(typeof pr === 'function') {
      cb = f;
      f = pr;
      pr = null;
    }
    if(!results) results = [];
    if(!n) n = 0;

    f({
      user: config.user,
      repo: config.repo,
      number: pr ? pr.number : null,
      page: n,
      per_page: 100

    }, function(err, res) {
      if(err || !res) return cb(err);

      results = results.concat(res);

      // if we got to the end of the results, return them
      if(res.length < 100) {
        return cb(null, results)
      }

      // otherwise keep getting more pages recursively
      getAllPages(pr, f, cb, n+1, results);
    })
  }

  // closes the PR. if `message` is provided, it will be posted as a comment
  function closePR(message, pr, cb) {
    // message is optional
    if(typeof pr === 'function') {
      cb = pr;
      pr = message;
      message = '';
    }

    if(message) {
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

    }, function(err, res) {
      if(err) return cb(err);
      voting.emit('close', pr);
      console.log('Closed PR #' + pr.number);

      // Tweet PR closed
      Twitter.postTweet('PR #' + pr.number + ' has been closed: https://github.com/botwillacceptanything/botwillacceptanything/pull/' + pr.number);

      return cb(null, res);
    });
  }

  // merges a PR into master. If it can't be merged, a warning is posted and the PR is closed.
  function mergePR(pr, cb) {
    gh.pullRequests.get({
      user: config.user,
      repo: config.repo,
      number: pr.number

    }, function(err, res) {
      if(err || !res) return cb(err);
      if(!res.mergeable) {
        return closePR(couldntMergeWarning, pr, function() {
          cb(new Error('Could not merge PR because the author of the PR is a smeghead.'));
        });
      }

      gh.pullRequests.merge({
        user: config.user,
        repo: config.repo,
        number: pr.number
      }, function(err, res) {
        if(!err){ 
          voting.emit('merge', pr);
          
          // Tweet PR merged
          Twitter.postTweet('PR #' + pr.number + ' has been merged: https://github.com/botwillacceptanything/botwillacceptanything/pull/' + pr.number);
        }
        cb(err, res);
      });
    });
  }

  voting.handlePR = handlePR;
  return voting;
};
