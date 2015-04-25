(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'assert',
    'lodash',
    'nock',

    '../../config.js',
    '../../params.js',
    '../mocks/github',
    '../mocks/thecatapi',
    '../../lib/voting/voting.js',
  ];

  define(deps, function (assert, _, nock, config, params, mock, mockingCat, Voting) {
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
        state: 'open',
        mergeable: true,
      };

      var voting;

      function addComments(pr, positive, negative) {
        var i;
        for (i = 0; i < positive; i++) {
          pr.comments.push({
            user: { login: 'positive' + i },
            body: ':+1:',
            id: 1,
          });
        }
        for (i = 0; i < negative; i++) {
          pr.comments.push({
            user: { login: 'negative' + i },
            body: ':-1:',
            id: 1,
          });
        }
      }

      function getVoters(pr) {
        return pr.comments.map(function (comment) {
          return comment.user.login;
        });
      }

      beforeEach(function () {
        voting = new Voting({
          user: config.user,
          repo: config.repo,
          votingParams: params.voting,
        });
      });

      afterEach(function () {
        voting.destroy();
        nock.cleanAll();
      });

      it("should ignore a PR that hasn't been open for long enough", function (done) {
        var testPR = _.merge({}, basePR);
        testPR.created_at = Date.now();

        voting.processPR(testPR, function (err, res) {
          assert.strictEqual(res, false, 'Did not cancel processing of PR');
          done();
        });
      });

      it("should ignore a PR that doesn't have enough votes", function (done) {
        var testPR = _.merge({}, basePR);
        addComments(testPR, 3, 0);
        getVoters(testPR).forEach(function (user) {
          voting.starGazers[user] = true;
        });

        voting.processPR(testPR, function (err, res) {
          assert.strictEqual(res, false, 'Did not cancel processing of PR');
          done();
        });
      });

      it("should edit non-stargazers' comments", function (done) {
        var mockEditComment = mock.issues.editComment();
        var testPR = _.merge({}, basePR);
        addComments(testPR, 3, 0);
        getVoters(testPR).slice(0, -1).forEach(function (user) {
          voting.starGazers[user] = true;
        });

        var result = voting.processPR(testPR, function (err, res) {
          if (err) { throw err; }
          mockEditComment.done();
          done();
        });
      });

      it('should merge passed PRs', function (done) {
        var mockPRGet = mock.pullRequests.get(true);
        var mockPRMerge = mock.pullRequests.merge();
        var mockCreateComment = mock.issues.createComment();
        var mockCat = mockingCat();
        var testPR = _.merge({}, basePR);
        voting.pullRequests[testPR.number] = testPR;
        // One less since the ticket creator is already counted.
        addComments(testPR, voting.minVotes - 1, 0);
        getVoters(testPR).forEach(function (user) {
          voting.starGazers[user] = true;
        });

        var result = voting.processPR(testPR, function (err, res) {
          if (err) { throw err; }
          mockCreateComment.done();
          mockPRGet.done();
          mockPRMerge.done();
          mockCat.done();
          done();
        });
      });

      it('should close failed PRs', function (done) {
        var testPR = _.merge({}, basePR);
        voting.pullRequests[testPR.number] = testPR;
        addComments(testPR, 0, voting.minVotes);
        getVoters(testPR).forEach(function (user) {
          voting.starGazers[user] = true;
        });

        var mockPRClose = mock.pullRequests.close(testPR);
        var mockCreateComment = mock.issues.createComment();
        var mockCat = mockingCat();

        var result = voting.processPR(testPR, function (err, res) {
          if (err) { throw err; }
          mockCreateComment.done();
          mockPRClose.done();
          mockCat.done();
          done();
        });
      });

      it("should merge a PR that has a guaranteed win after the time limit", function (done) {
        var mockPRGet = mock.pullRequests.get(true);
        var mockPRMerge = mock.pullRequests.merge();
        var mockCreateComment = mock.issues.createComment();
        var mockCat = mockingCat();
        var testPR = _.merge({}, basePR);
        voting.pullRequests[testPR.number] = testPR;
        // One less since the ticket creator is already counted.
        addComments(testPR, voting.votingParams.guaranteedResult - 1, 0);
        getVoters(testPR).forEach(function (user) {
          voting.starGazers[user] = true;
        });

        var result = voting.processPR(testPR, function (err, res) {
          if (err) { throw err; }
          mockCreateComment.done();
          mockPRGet.done();
          mockPRMerge.done();
          mockCat.done();
          done();
        });
      });

      it("should close a PR that has a guaranteed lose after the time limit", function (done) {
        var testPR = _.merge({}, basePR);
        voting.pullRequests[testPR.number] = testPR;
        addComments(testPR, 0, voting.votingParams.guaranteedResult);
        getVoters(testPR).forEach(function (user) {
          voting.starGazers[user] = true;
        });

        var mockPRClose = mock.pullRequests.close(testPR);
        var mockCreateComment = mock.issues.createComment();
        var mockCat = mockingCat();

        var result = voting.processPR(testPR, function (err, res) {
          if (err) { throw err; }
          mockCreateComment.done();
          mockPRClose.done();
          mockCat.done();
          done();
        });
      });

      it("should ignore a PR that has a guaranteed win before the time limit", function (done) {
        var testPR = _.merge({}, basePR);
        // Ten minutes ago
        testPR.created_at = Date.now() - 1000 * 60 * 10;
        voting.pullRequests[testPR.number] = testPR;
        // One less since the ticket creator is already counted.
        addComments(testPR, voting.votingParams.guaranteedResult - 1, 0);
        getVoters(testPR).forEach(function (user) {
          voting.starGazers[user] = true;
        });

        voting.processPR(testPR, function (err, res) {
          assert.strictEqual(res, false, 'Did not cancel processing of PR');
          done();
        });
      });
    });
  });
}());
