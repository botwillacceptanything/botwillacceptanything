
var EventEmitter = require('events').EventEmitter;
var request = require('request');

// voting settings
var PERIOD = 30; // time for the vote to be open, in minutes
var MIN_VOTES = 5; // minimum number of votes for a decision to be made
var REQUIRED_SUPERMAJORITY = 0.65;

var MINUTE = 60 * 1000; // (one minute in ms)

var decideVoteResult = function(yeas, nays) {
  // vote passes if yeas > nays
  return (yeas / (yeas + nays)) > REQUIRED_SUPERMAJORITY;
}

var voteStartedComment = '#### :ballotbox: Voting procedure reminder:\n' +
  'To cast a vote, post a comment containing `:+1:` (:+1:), or `:-1:` (:-1:).\n' +
  'Remember, you **must star this repo for your vote to count.**\n\n' +
  'All comments within this discussion are searched for votes, regardless of the time of posting.\n' +
  'You can cast as many votes as you want, but only the last one will be counted.\n' +
  '(You may consider editing your comment instead of adding a new one.)\n' +
  'Comments containing both up- and dow-votes are disregarded.\n' +
  'Pull request is not counted as a vote, so vote for (or against) your own PRs!\n' +
  'A decision will be made after this PR has been open for **'+PERIOD+'** ' +
  'minutes, and at least **'+MIN_VOTES+'** votes have been made.\n\n' +
  'A supermajority of ' + (REQUIRED_SUPERMAJORITY * 100) + '% is required for the vote to pass.\n\n' +
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
module.exports = function(config, gh) {
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

    checkPrVoteLength(pr);

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

  function checkPrVoteLength(pr) {
    // Grab the contents of voting.js and reject the pull request if they are too long.
    var voteFileName = 'https://raw.githubusercontent.com/' + pr.head.repo.full_name + '/' + pr.merge_commit_sha + '/voting.js'
      , currentFileName = 'https://raw.githubusercontent.com/botwillacceptanything/botwillacceptanything/master/voting.js';
    var prVoteFile, currentVoteFile;

    function compareVoteFiles() {
      // If one of the files isn't loaded yet, we're not ready to compare.
      if (typeof prVoteFile === 'undefined' || typeof currentVoteFile === 'undefined') {
        return;
      }

      if (prVoteFile.length > currentVoteFile.length) {
         gh.issues.createComment({
          user: config.user,
          repo: config.repo,
          number: pr.number,
          body: 'Warning: New voting strategy is ineffecient. Do not vote for this PR unless you hate your planet.',
        }, function(err, res) {
        });
      }
    }

    request(voteFileName, function (err, response, body) {
      // Handle any failed requests.
      if (err) { return console.error('Failed to get PR voting.js', err); }
      if (response.statusCode !== 200) {
        return console.error('PR voting.js status code was', response.statusCode);
      }

      prVoteFile = body;
      compareVoteFiles();
    });

    request(currentFileName, function (err, response, body) {
      // Handle any failed requests.
      if (err) { return console.error('Failed to get PR voting.js', err); }
      if (response.statusCode !== 200) {
        return console.error('PR voting.js status code was', response.statusCode);
      }

      currentVoteFile = body;
      compareVoteFiles();
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
        if(!err) voting.emit('merge', pr);
        cb(err, res);
      });
    });
  }

  voting.handlePR = handlePR;
  return voting;
};
