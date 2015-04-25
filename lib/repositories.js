(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'lodash',

    '../config',
    '../params',
  ];

  define(deps, function (_, config, params) {
    var repos = [
      {
        repo: config.repo,
        user: config.user,
        votingParams: params.voting,
        main: true,
      },
    ];

    if (typeof config.additionalRepos !== 'undefined') {
      config.additionalRepos.forEach(function (repo) {
        var votingParams = _.merge({}, params.voting);
        repos.push({
          repo: repo.repo,
          user: repo.user,
          votingParams: votingParams,
          main: false,
        });
      });
    }

    module.exports = repos;
  });
}());
