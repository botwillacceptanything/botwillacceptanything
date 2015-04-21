(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'deferred',

        '../../config',
        '../events',
        'irc',
        'util',
        '../conversation'
    ];

    define(deps, function (deferred, config, events, irc, util, Conversation) {
        module.exports = function () {
            var conversations = {};
            var muted = false;
            if(!config.irc) {
                console.error('No IRC settings in config. IRC bot disabled.');
                return {
                  destroy: function () {},
                };
            }
            else {
                console.log("IRC is trying to connect to " + config.irc.host + ":" + config.irc.port + " as " + config.irc.user);
            }

            var d;

            var ircConfig = {
                userName: irc.config.username,
                realName: irc.config.realname,
                autoRejoin: true,
                port: config.irc.port,
                secure: config.irc.secure,
                channels: [ config.irc.channel ]
            };
            if (typeof config.irc.password !== 'undefined') {
              ircConfig.password = config.irc.password;
            }
            var client = new irc.Client(config.irc.host, config.irc.user, ircConfig);
            client.on('error', function(err) {
                console.error('IRC ERROR: ' + JSON.stringify(err));
            });
            function checkInitNewConversation(nick) {
                if(nick !== config.irc.user) {
                    if(conversations[nick] === undefined || conversations[nick] === null) {
                        var c = new Conversation(nick, config.irc.user);
                        conversations[nick] = c;
                        if(muted) {
                            c.mute();
                        }
                        else {
                            c.greet();
                        }
                        c.on("say", function(msg) {
                            client.say(config.irc.channel, msg);
                        });
                        c.on("mute", function() {
                            for(var key in conversations) {
                                conversations[key].mute();
                                muted = true;
                            }
                        });
                        c.on("unmute", function() {
                            for(var key in conversations) {
                                conversations[key].unmute();
                                muted = false;
                            }
                        });
                    }
                }
            }
            client.on('message', function (from, to, message) {
                if(to == config.irc.channel) {
                    checkInitNewConversation(from);
                    var c = conversations[from];
                    if(c !== undefined && c !== null) {
                        c.react(message);
                    }
                }
            });
            client.on('join' + config.irc.channel, function (nick) {
                checkInitNewConversation(nick);
                if (nick !== config.irc.user) { return; }
                d.resolve(client);
                client.say(channel, "Welcome to " + channel + ", " + nick + "!");
            });
            client.on('registered', function (msg) {
                console.log("Successfully connected to the IRC network!");
            });
            client.on('ctcp-version', function (from, to, message) {
                Client.notice(from, config.irc.user + " - https://github.com/botwillacceptanything/botwillacceptanything");
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
