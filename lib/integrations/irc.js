(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'deferred',

        '../../config',
        '../events',
        'irc',
    ];

    define(deps, function (deferred, config, events, irc) {
        module.exports = function () {
            if(!config.irc) {
                console.error('No IRC settings in config. IRC bot disabled.');
                return null;
            }

            var d = deferred();

            var client = new irc.Client('irc.freenode.net', config.irc.user, {
                channels: [ config.irc.channel ]
            });
            client.on('error', function(err) {
                console.error('IRC ERROR: ' + JSON.stringify(err));
            });

            client.on('join' + config.irc.channel, function (nick) {
              if (nick !== config.irc.user) { return; }
              d.resolve(client);
            });
            

            events.on('bot.pull_request.vote_started', function (pr) {
                var message = 'New PR: #' + pr.number + ' - "' + pr.title + '" - author: @' + pr.user.login + ' - ' + pr.html_url;
                client.say(config.irc.channel, message);
            });

            events.on('github.pull_request.closed', function (event) {
                var pr = event.pull_request;
                // Don't post a message if the vote passed.
                if (pr.merged_at !== null) { return; }
                var message = 'Voting for PR #' + pr.number + ' (' + pr.title + ') FAILED :-1:';
                client.say(config.irc.channel, message);
            });

            events.on('github.pull_request.merged', function (event) {
                var pr = event.pull_request;
                var message = 'Voting for PR #' + pr.number + ' (' + pr.title + ') PASSED :+1:';
                client.say(config.irc.channel, message);
            });

            return d.promise();
        };
    });
}());
