(function () {
    'use strict';

    module.exports = {
        webserver: {
            port: 3000
        },

        evil: false,

        user: "YOUR_GITHUB_USERNAME",
        repo: "botwillacceptanything",
        githubAuth: {
            type: "oauth",
            token: "YOUR_OAUTH_TOKEN",
            webhookSecret: 'SECRET'
        },
        db: {
            sqlite: {
                name: "database",
            },
        },
        mocks: {
            twitter: true,
        },
        features: {
            twitter: false,
        },
        /*
        irc: {
            host: 'irc.freenode.net',
            user: 'UnconfiguredBot',
            channel: '#anythingbot',
            password: 'yourNickservPassword',
        },
        */
       voting: {
         period: 15,
         period_jitter: 0.2,
         minVotes: 7,
         supermajority: 0.5,
         pollInterval: 3, // Minutes
       },

    };
}());
