(function () {
    'use strict';

    module.exports = {
        webser: {
            port: 3000
        },

        user: "YOUR_GITHUB_USERNAME",
        repo: "botwillacceptanything",
        githubAuth: {
            type: "oauth",
            token: "YOUR_OAUTH_TOKEN",
            webhookSecret: 'SECRET'
        }
    };
}());
