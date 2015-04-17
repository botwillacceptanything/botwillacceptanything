(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'deferred',

        '../../config',
        '../events',
        'irc',
        'util',
        '../communicator'
    ];

    define(deps, function (deferred, config, events, irc, util, Comm) {
        module.exports = function () {
            if(!config.irc) {
                console.error('No IRC settings in config. IRC bot disabled.');
                return {
                  destroy: function () {},
                };
            }

            var d;

            var client = new irc.Client(config.irc.host, config.irc.user, {
                channels: [ config.irc.channel ]
            });
            client.on('error', function(err) {
                console.error('IRC ERROR: ' + JSON.stringify(err));
            });

            client.on('join' + config.irc.channel, function (nick) {
                var greeting = Comm.greet(nick);
                if (greeting) {
                    client.say(config.irc.channel, greeting);
                }
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

            function eventPullRequestVoteStarted(pr) {
                var message = buildMessage('started', pr);
                client.say(config.irc.channel, message);
            }

            function eventPullRequestMerged(event) {
                var pr = event.pull_request;
                var message = buildMessage('merged', pr);
                client.say(config.irc.channel, message);
            }

            function eventPullRequestClosed(event) {
                var pr = event.pull_request;
                // Don't post a message if the vote passed.
                if (pr.merged_at !== null) { return; }
                var message = buildMessage('closed', pr);
                client.say(config.irc.channel, message);
            }

            events.on('bot.pull_request.vote_started', eventPullRequestVoteStarted);
            events.on('github.pull_request.closed', eventPullRequestClosed);
            events.on('github.pull_request.merged', eventPullRequestMerged);

            // If we're running tests, immediately return the client.
            if (process.env.BUILD_ENVIRONMENT === 'test') {
              return {
                client: client,
                destroy: function () {
                  events.removeListener('bot.pull_request.vote_started', eventPullRequestVoteStarted);
                  events.removeListener('github.pull_request.closed', eventPullRequestClosed);
                  events.removeListener('github.pull_request.merged', eventPullRequestMerged);
                },
              };
            }

            d = deferred();
            return d.promise();
        };
    });
}());
