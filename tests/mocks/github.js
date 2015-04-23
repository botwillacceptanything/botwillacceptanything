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

        labels: function (labels) {
          if (typeof labels === 'undefined') { labels = []; }
          return nock(domain)
            .get(repo + 'issues/1/labels?' + token)
            .reply(200, labels);
        },

        updateLabels: function (labels) {
          return nock(domain)
            .patch(repo + 'issues/1?' + token, { labels: labels })
            .reply(200);
        },
      },

      labels: {
        list: function (labels) {
          return nock(domain)
            .get(repo + 'labels?' + token)
            .reply(200, labels);
        },

        create: function () {
          return nock(domain)
            .post(repo + 'labels?' + token)
            .thrice() // We create three repo labels when testing.
            .reply(200, [
            ]);
        },
      },

      pullRequests: {
        get: function (mergeable) {
          if (typeof mergeable === 'undefined') { mergeable = true; }
          return nock(domain)
            .get(repo + 'pulls/1?' + token)
            .reply(200, {
              mergeable: mergeable,
            });
        },

        merge: function () {
          return nock(domain)
            .put(repo + 'pulls/1/merge?' + token)
            .reply(200);
        },

        close: function (pr) {
          return nock(domain)
            .patch(repo + 'pulls/1?' + token, { title: pr.title, state: 'closed' })
            .reply(200);
        },
      },
    };
  });
}());
