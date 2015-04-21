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
            channel: '#botwillacceptanything',
            realname: 'http://botwillacceptanything.com - #anythingbot',
            username: 'botwillacceptanything',
            port: 6697,
            secure: true,
            password: 'yourNickservPassword',
        },
        */
       voting: {
         period: 15,
         period_jitter: 0.2,
         minVotes: 8,
         supermajority: 0.65,
         pollInterval: 3, // Minutes
       },

    };
}());
