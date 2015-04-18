(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        '../../config.js',
        '../events',
        'twitter'
    ];

    define(deps, function(config, events, Twitter) {
        module.exports = function () {
            // If twitter is not enabled, return immediately.
            if (config.features.twitter !== true) {
              return {
                destroy: function () {},
              };
            }
            var client = new Twitter({
                consumer_key: 'xPBdmKMtzBVNCP7sosmCd9mJV',
                consumer_secret: 'VYaUwAsQpsfMyNnAtVmim5RpJ7kxxxp7hE2BoZQQe3qraA7Qtn',
                access_token_key: '3148038378-jZ7yFPOKZZBcbFV0Ws3gAWmB4kdvOdGWvKAJjRb',
                access_token_secret: '8snyglTPXq80XbDNAUd6vfImSep4emX4A9ViDZNeJ19Qn'
            });

            var params = {screen_name: 'anythingbot'};

                // Post the provided tweet to Twitter feed
            function postTweet(tweet) {
                client.post('statuses/update', {status: tweet}, function (error, tweetBody, response) {
                    if (error) throw error;
                    console.log("Tweeted: " + tweet);
                });
            }

            function eventPullRequestMerged(event) {
                var pr = event.pull_request;
                // Tweet PR merged
                postTweet('I now have the ability to: ' + pr.title + ' ' + pr.html_url);
            }

            function eventPullRequestClosed(event) {
                var pr = event.pull_request;

                // Closed event fires for both merged and rejected scenarios, so
                // we must exit if the vote was successful and PR merged.
                if (pr.merged_at) { return; }

                // Tweet PR closed
                postTweet('PR #' + pr.number + ' has been closed: ' + pr.html_url);
            }

            function eventPullRequestVoteStarted(pr) {
                // Tweet vote started
                postTweet('Vote started for PR #' + pr.number + ': ' + pr.html_url);
            }

            events.on('github.pull_request.merged', eventPullRequestMerged);
            events.on('github.pull_request.closed', eventPullRequestClosed);
            events.on('bot.pull_request.vote_started', eventPullRequestVoteStarted);

            return {
              destroy: function () {
                events.removeListener('github.pull_request.merged', eventPullRequestMerged);
                events.removeListener('github.pull_request.closed', eventPullRequestClosed);
                events.removeListener('bot.pull_request.vote_started', eventPullRequestVoteStarted);
              },
            };
        };
    });

}());
