(function() {
    var define = require('amdefine')(module);

    var deps = [
        'child_process',
        'gift',
        'lodash',

        './config.loader',
        './lib/events.js',
        './lib/github.js',
        './lib/integrations',
        './lib/logger',
        './lib/media',
        './lib/talk.js',
        './lib/voting',
        './lib/webserver.js'
    ];

    define(deps, function(
        Spawn,
        git,
        _,

        config,
        events,
        gh,
        integrations,
        media,
        Logger,
        Talk,
        voting,
        Webserver
    ) {
        var spawn = Spawn.spawn;
        var webserver = Webserver(config);
        var talk = Talk(config, gh);
        // If no env is set yet, set it to development.
        if (typeof process.env.BUILD_ENVIRONMENT === 'undefined') {
            process.env.BUILD_ENVIRONMENT = 'development';
        }

        // if we merge something, `git sync` the changes and start the new version
        events.on('github.pull_request.merged', function () {
            sync(function (err) {
                if (err) { return console.error('error pulling from origin/master:', err); }

                // Install the latest NPM packages and then restart.
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
            repo.branch(function (err, head) {
                if (err) { return cb(err); }
                cb(null, head.commit.id);
            });
        }

        // starts ourself up in a new process, and kills the current one
        function restart() {
            var child = spawn('node', [__dirname + "/launcher.js"], {
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

        function initializeBotSystems(commitHash) {
            console.log('Bot is initialized. HEAD:', commitHash);
            considerExistence();

            // greet the other bots
            //talk.speak();

            // Allow the voting system to bootstrap and begin monitoring PRs.
            new voting({
              repo: config.repo,
              user: config.user,
            }, config.voting);

            if (typeof config.additionalRepos !== 'undefined') {
              config.additionalRepos.forEach(function (repo) {
                var votingConfig = _.merge({}, config.voting);
                // Merge in repo-specific voting configurations.
                if (typeof repo.voting !== 'undefined') {
                  _.merge(votingConfig, repo.voting);
                }
                new voting({
                  repo: repo.repo,
                  user: repo.user,
                }, votingConfig);
              });
            }
        }

        function main() {
            // find the hash of the current HEAD
            head(function (err, initial) {
                if (err) { return console.error('error checking HEAD:', err); }

                // Unless config.sync_latest is enabled, don't pull the latest code.
                // This is most commonly used for development.
                if (config.sync_latest !== true) { return initializeBotSystems(initial); }

                // make sure we are in sync with the remote repo
                sync(function (err) {
                    if (err) { return console.error('error pulling from origin/master:', err); }

                    head(function (err, current) {
                        if (err) { return console.error('error checking HEAD:', err); }

                        // if we just got a new version, upgrade npm packages and restart.
                        if (initial !== current) { return restart(); }

                        initializeBotSystems(current);
                    });
                });
            });
        }

        integrations()
            .then(main, function (err) {
                Logger.error(err);
                Logger.error(err.stack);
            });

        process.on('uncaughtException', function (err) {
            console.error('UNCAUGHT ERROR: ' + err + '\n' + err.stack);
        });
    });
}());
