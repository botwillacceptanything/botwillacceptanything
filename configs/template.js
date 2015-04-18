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
                name: "database"
            }
        },

        mocks: {
            twitter: true
        },

        features: {
            twitter: false
        },

        /*
        irc: {
            host: 'irc.freenode.net',
            user: 'UnconfiguredBot',
            channel: '#botwillacceptanything',
        },
        //*/

        voting: {
            // voting settings
            period: 15, // time for the vote to be open, in minutes
            periodJitter: 0.2, // fraction of period that is random
            minVotes: 8, // minimum number of votes for a decision to be made
            requiredSupermajority: 0.65,
            guarantedResult: Math.ceil(8 * 0.65),
            pollInterval: 3 * 60 * 1000, // how often to check the open PRs (in ms)
            votePositive: ':+1:',
            voteNegative: ':-1:',
            voteMonkey: [
                ':monkey:',
                ':monkey_face:',
                ':hear_no_evil:',
                ':see_no_evil:',
                ':speak_no_evil:'
            ]
        }

    };
}());
