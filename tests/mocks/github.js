(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'nock',
    
    '../../config.js',
  ];

  define(deps, function (nock, config) {
    var domain = 'https://api.github.com';
    var repo = '/repos/' + config.user + '/' + config.repo + '/';
    var token = 'access_token=' + config.githubAuth.token;
    //nock.recorder.rec();
    module.exports = {
      issues: {
        createComment: function () {
          return nock(domain)
            .post(repo + 'issues/1/comments?' + token)
            .reply(200, {
              id: 1,
            });
        },

        editComment: function () {
          return nock(domain)
            .patch(repo + 'issues/comments/1?' + token)
            .reply(200, {
              id: 1,
            });
        },
      },
    };
  });
}());
