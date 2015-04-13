(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        '../events',
        'twitter'
    ];

    define(deps, function(events, Twitter) {
        module.exports = function () {
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

            events.on('github.pull_request.merged', function (event) {
                var pr = event.pull_request;
                // Tweet PR merged
                postTweet('I now have the ability to ' + pr.title + pr.html_url);
            });

            events.on('bot.pull_request.vote_started', function (pr) {
                // Tweet vote started
                postTweet('Vote started for PR #' + pr.number + ': ' + pr.html_url);
            });

            events.on('github.pull_request.closed', function (event) {
                var pr = event.pull_request;
                // Tweet PR closed
                postTweet('PR #' + pr.number + ' has been closed: ' + pr.html_url);
            });
        };
    });

}());
