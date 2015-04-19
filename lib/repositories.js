(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'lodash',

    '../config',
  ];

  define(deps, function (_, config) {
    var repos = [
      {
        repo: config.repo,
        user: config.user,
        votingConfig: config.voting,
        main: true,
      },
    ];

    if (typeof config.additionalRepos !== 'undefined') {
      config.additionalRepos.forEach(function (repo) {
        var votingConfig = _.merge({}, config.voting);
        // Merge in repo-specific voting configurations.
        if (typeof repo.voting !== 'undefined') {
          _.merge(votingConfig, repo.voting);
        }
        repos.push({
          repo: repo.repo,
          user: repo.user,
          votingConfig: votingConfig,
          main: false,
        });
      });
    }

    module.exports = repos;
  });
}());
