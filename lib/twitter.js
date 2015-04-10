(function () {
    'use strict';
    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: 'xPBdmKMtzBVNCP7sosmCd9mJV',
        consumer_secret: 'VYaUwAsQpsfMyNnAtVmim5RpJ7kxxxp7hE2BoZQQe3qraA7Qtn',
        access_token_key: '3148038378-jZ7yFPOKZZBcbFV0Ws3gAWmB4kdvOdGWvKAJjRb',
        access_token_secret: '8snyglTPXq80XbDNAUd6vfImSep4emX4A9ViDZNeJ19Qn'
    });

    var params = {screen_name: 'anythingbot'};

    module.exports = {

        // Post the provided tweet to Twitter feed
        postTweet: function (tweet) {
            client.post('statuses/update', {status: tweet}, function (error, tweetBody, response) {
                if (error) throw error;
                console.log("Tweeted: " + tweet);
            });
        }
    };
}());