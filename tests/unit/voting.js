(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'assert',
    'lodash',
    'nock',

    '../mocks/github.js',
    '../../lib/voting.js',
  ];

  define(deps, function (assert, _, nock, mock, voting) {
    describe('voting', function () {
      var basePR = {
        number: 1,
        title: 'Test PR',
        html_url: 'http://example.com',
        created_at: 'Jan 1, 2014',
        user: {
          login: 'TestUser',
        },
        comments: [],
      };

      function addComments(pr, positive, negative) {
        var i;
        for (i = 0; i < positive; i++) {
          pr.comments.push({
            user: { login: 'positive' + i },
            body: ':+1:',
            id: 1,
          });
        }
      }

      function getVoters(pr) {
        return pr.comments.map(function (comment) {
          return comment.user.login;
        });
      }

      function resetStargazers() {
        Object.keys(voting.testing.cachedStarGazers).forEach(function (name) {
          delete voting.testing.cachedStarGazers[name];
        });
        voting.testing.cachedStarGazers[basePR.user.login] = true;
      }

      afterEach(function () {
        resetStargazers();
      });

      it("should ignore a PR that hasn't been open for long enough", function (done) {
        var mockCreateComment = mock.issues.createComment();
        var testPR = _.merge({}, basePR);
        testPR.created_at = Date.now();

        var result = voting.testing.processPR(testPR);
        if (result === false) {
          done();
        }
      });

      it("should ignore a PR that doesn't have enough votes", function (done) {
        var mockCreateComment = mock.issues.createComment();
        var testPR = _.merge({}, basePR);
        addComments(testPR, 3, 0);
        getVoters(testPR).forEach(function (user) {
          voting.testing.cachedStarGazers[user] = true;
        });

        var result = voting.testing.processPR(testPR);
        if (result === false) {
          done();
        }
      });

      it("should edit non-stargazers' comments", function (done) {
        var mockEditComment = mock.issues.editComment();
        var testPR = _.merge({}, basePR);
        addComments(testPR, 3, 0);
        getVoters(testPR).slice(0, -1).forEach(function (user) {
          voting.testing.cachedStarGazers[user] = true;
        });

        var result = voting.testing.processPR(testPR);
        return mockEditComment.isDone() ? done() : assert.ifError('Comment not edited');
      });
    });
  });
}());
