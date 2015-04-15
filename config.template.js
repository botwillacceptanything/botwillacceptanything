(function () {
    'use strict';

    module.exports = {
        webserver: {
            port: 3000
        },

        user: "YOUR_GITHUB_USERNAME",
        repo: "botwillacceptanything",

        githubAuth: {
            type: "oauth",
            token: "YOUR_OAUTH_TOKEN",
            webhookSecret: 'SECRET'
        },

        mocks: {
            twitter: true
        },

        voting: {
            // voting settings
            period: 15, // time for the vote to be open, in minutes
            periodJitter: 0.2, // fraction of period that is random
            minVotes: 8, // minimum number of votes for a decision to be made
            requiredSupermajority: 0.65,
            pollInterval: 3000 // how often to check the open PRs (in seconds)
        }
    };
}());
