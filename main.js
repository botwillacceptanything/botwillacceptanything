(function() {
    var define = require('amdefine')(module);

    var deps = [
        'gift',
        'child_process',

        './config.js',
        './lib/events.js',
        './lib/github.js',
        './lib/integrations/index.js',
        './lib/logger',
        './tests/mocks/index.js',
        './lib/talk.js',
        './lib/voting',
        './lib/webserver.js'
    ];

    define(deps, function(
        git,
        Spawn,

        config,
        events,
        gh,
        integrations,
        Logger,
        mocks,
        Talk,
        voting,
        Webserver
    ) {
        var spawn = Spawn.spawn;
        var talk = Talk(config, gh);
        var webserver = Webserver(config);

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

        function main() {
            // find the hash of the current HEAD
            head(function (err, initial) {
                if (err) { return console.error('error checking HEAD:', err); }

                // make sure we are in sync with the remote repo
                sync(function (err) {
                    if (err) { return console.error('error pulling from origin/master:', err); }

                    head(function (err, current) {
                        if (err) { return console.error('error checking HEAD:', err); }

                        // if we just got a new version, upgrade npm packages and restart.
                        if (initial !== current) { return restart(); }

                        console.log('Bot is initialized. HEAD:', current);
                        considerExistence();

                        // greet the other bots
                        talk.speak();

                        // Allow the voting system to bootstrap and begin monitoring PRs.
                        voting.initialize();
                    });
                });
            });
        }

        mocks()
            .then(integrations)
            .then(main, function (err) {
                Logger.error(err);
                Logger.error(err.stack);
            });

        process.on('uncaughtException', function (err) {
            console.error('UNCAUGHT ERROR: ' + err + '\n' + err.stack);
        });
    });
}());
