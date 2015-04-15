(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'deferred',

        '../../config',
        '../events',
        'irc',
        'util'
    ];

    define(deps, function (deferred, config, events, irc, util) {
        module.exports = function () {
            if(!config.irc) {
                console.error('No IRC settings in config. IRC bot disabled.');
                return null;
            }

            var d = deferred();

            var ircHost = 'irc.freenode.net';
            if (process.env.BUILD_ENVIRONMENT === 'test') { ircHost = 'localhost'; }
            var client = new irc.Client(ircHost, config.irc.user, {
                channels: [ config.irc.channel ]
            });
            client.on('error', function(err) {
                console.error('IRC ERROR: ' + JSON.stringify(err));
            });

            client.on('join' + config.irc.channel, function (nick) {
              if (nick !== config.irc.user) { return; }
              d.resolve(client);
            });

            function buildMessage(state, pr) {
                var lede;
                if (state === 'started') {
                    lede = 'New PR:';
                } else if (state === 'closed') {
                    lede = 'Voting: FAILED :-1:';
                } else if (state === 'merged') {
                    lede = 'Voting: PASSED :+1:';
                } else {
                    // TODO: log error/don't do anything?
                    lede = 'PR: "' + state + '":';
                }
                return util.format('%s #%d - "%s" - author: @%s - %s', lede, pr.number, pr.title, pr.user.login, pr.html_url);
            }

            events.on('bot.pull_request.vote_started', function (pr) {
                var message = buildMessage('started', pr);
                client.say(config.irc.channel, message);
            });

            events.on('github.pull_request.closed', function (event) {
                var pr = event.pull_request;
                // Don't post a message if the vote passed.
                if (pr.merged_at !== null) { return; }
                var message = buildMessage('closed', pr);
                client.say(config.irc.channel, message);
            });

            events.on('github.pull_request.merged', function (event) {
                var pr = event.pull_request;
                var message = buildMessage('merged', pr);
                client.say(config.irc.channel, message);
            });

            // If we're running tests, immediately return the client.
            if (process.env.BUILD_ENVIRONMENT === 'test') {
              return client;
            }
            return d.promise();
        };
    });
}());
