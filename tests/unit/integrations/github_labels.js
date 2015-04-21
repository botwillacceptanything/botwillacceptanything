(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'lodash',

    '../../../config.js',
    '../../../lib/events.js',
    '../../mocks/github',
    '../../../lib/integrations/github_labels.js',
  ];

  define(deps, function (_, config, events, mock, setupGitHubLabels) {
    describe('integrations/gitHub_labels', function () {
      var destroyGitHubLabels, mockRepoIssueList;
      var labels = {};

      var mockPR = {
        number: 1,
        merged_at: null,
        head: {
          repo: {
            name: config.repo,
          },
          user: {
            login: config.user,
          },
        },
      };

      beforeEach(function () {
        mockRepoIssueList = mock.labels.list(_.values(labels));
        destroyGitHubLabels = setupGitHubLabels();
      });

      afterEach(function () {
        destroyGitHubLabels();
      });

      it('should fetch and create the required labels', function (done) {
        var mockCreateIssueLabels = mock.labels.create();
        setTimeout(function () {
          mockRepoIssueList.done();
          mockCreateIssueLabels.done();

          // Set up the true list of labels.
          labels = {
            'voting': { name: 'Voting Underway', color: '8AEBC9' },
            'rejected': { name: 'Rejected', color: 'FF6333' },
            'merged': { name: 'Merged', color: '88C451' }
          };

          done();
        }, 10);
      });

      it('should mark a new PR as "Voting Underway"', function (done) {
        var mockGetIssueLabels = mock.issues.labels();
        var mockUpdateIssueLabels = mock.issues.updateLabels([labels.voting]);
        events.emit('bot.pull_request.vote_started', mockPR);
        setTimeout(function () {
          mockGetIssueLabels.done();
          mockUpdateIssueLabels.done();
          done();
        }, 10);
      });

      it('should mark a failed PR as "Rejected"', function (done) {
        var mockGetIssueLabels = mock.issues.labels();
        var mockUpdateIssueLabels = mock.issues.updateLabels([labels.rejected]);
        events.emit('github.pull_request.closed', { pull_request: mockPR });
        setTimeout(function () {
          mockGetIssueLabels.done();
          mockUpdateIssueLabels.done();
          done();
        }, 10);
      });

      it('should mark a merged PR as "Merged"', function (done) {
        var mockGetIssueLabels = mock.issues.labels();
        var mockUpdateIssueLabels = mock.issues.updateLabels([labels.merged]);
        events.emit('github.pull_request.merged', { pull_request: mockPR });
        setTimeout(function () {
          mockGetIssueLabels.done();
          mockUpdateIssueLabels.done();
          done();
        }, 10);
      });
    });
  });
}());
