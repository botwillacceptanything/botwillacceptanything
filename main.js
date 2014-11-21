var POLL_INTERVAL = 15; // how often to check the open PRs (in seconds)

var config = require('./config.js');
var git = require('gift');
var Github = require('github');
var path = require('path');

var gh = new Github({
  version: '3.0.0',
  headers: {
    'User-Agent': config.user+'/'+config.repo
  }
});
gh.authenticate(config.githubAuth);

var voting = require('./voting.js')(config, gh);

// if we merge something, `git pull` the changes and start the new version
voting.on('merge', function(pr) {
  pull(restart);
});

// `git pull`
function pull(cb) {
  var repo = git(__dirname);
  repo.remote_fetch('origin', cb);
}

// gets and processes the currently open PRs
function checkPRs() {
  gh.pullRequests.getAll({
    user: config.user,
    repo: config.repo,
    per_page: 100

  }, function(err, res) {
    if(err || !res) return console.error('error in checkPRs:', err);

    // handle all the voting/merging logic in the voting module
    res.forEach(voting.handlePR);
  })
}

// check PRs every POLL_INTERVAL seconds
// TODO: use github hooks instead of polling
setInterval(checkPRs, POLL_INTERVAL * 1000);
checkPRs();
