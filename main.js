
var POLL_INTERVAL = 60 * 3; // how often to check the open PRs (in seconds)

var config = require('./config.js');
var git = require('gift');
var Github = require('github');
var path = require('path');
var spawn = require('child_process').spawn;

var gh = new Github({
  version: '3.0.0',
  headers: {
    'User-Agent': config.user+'/'+config.repo
  }
});
gh.authenticate(config.githubAuth);

var voting = require('./voting.js')(config, gh);
var webserver = require('./webserver.js')(config, gh);

// if we merge something, `git sync` the changes and start the new version
voting.on('merge', function(pr) {
  sync(function(err) {
    if(err) return console.error('error pulling from origin/master:', err);

    // start the new version
    restart();
  });
});

// `git sync`
function sync(cb) {
  var repo = git(__dirname);
  repo.sync(cb);
}

// gets the hash of the HEAD commit
function head(cb) {
  var repo = git(__dirname);
  repo.branch(function(err, head) {
    if(err) return cb(err);
    cb(null, head.commit.id);
  });
}

// starts ourself up in a new process, and kills the current one
function restart() {
  var child = spawn('node', [__filename], {
    detached: true,
    stdio: 'inherit'
  });
  child.unref();

  // TODO: ensure child is alive before terminating self
  process.exit(0);
}

function considerExistence() {
  return undefined;
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

function main() {
  // find the hash of the current HEAD
  head(function(err, initial) {
    if(err) return console.error('error checking HEAD:', err);

    // make sure we are in sync with the remote repo
    sync(function(err) {
      if(err) return console.error('error pulling from origin/master:', err);

      head(function(err, current) {
        if(err) return console.error('error checking HEAD:', err);

        // if we just got a new version, relaunch
        if(initial !== current) return restart();

        console.log('Bot is initialized. HEAD:', current);
        considerExistence();

        // check PRs every POLL_INTERVAL seconds
        // TODO: use github hooks instead of polling
        setInterval(checkPRs, POLL_INTERVAL * 1000);
        checkPRs();
      });
    });
  });
}
main();
