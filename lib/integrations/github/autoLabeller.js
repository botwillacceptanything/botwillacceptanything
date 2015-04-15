(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'deferred',
        './requiredLabels',
        '../../github',
        '../../../config',
        '../../events'
    ];

    define(deps, function (deferred, requiredLabels, gh, config, events) {
        module.exports = function () {
            var labelNames = requiredLabels.names;

            function logErrors(err) {
                console.error(err);
            }

            function getLabelsForPullRequest(pr) {
                var deferredLabels = deferred();

                gh.issues.getIssueLabels({
                    user: config.user,
                    repo: config.repo,
                    number: pr.number
                }, function (err, labels) {
                    if (err) {
                        deferredLabels.reject(err);
                    }
                    deferredLabels.resolve(labels);
                });

                return deferredLabels.promise();
            }

            function removeStatuses(toBeRemoved, labels) {
                return labels.filter(function (label) {
                    // Only keep labels that aren't in the toBeRemoved array.
                    return toBeRemoved.indexOf(label.name) < 0;
                });
            }

            function addStatuses(toBeAdded, labels) {
                var newStatuses = [],
                    addIfNotExists = function (newStatus) {
                        if (!statusExists(newStatus, labels)) {
                            // Status was not already in labels, push it into newStatuses
                            newStatuses.push(newStatus);
                        }
                    };

                if (Array.isArray(toBeAdded)) {
                    toBeAdded.forEach(addIfNotExists);
                } else {
                    addIfNotExists(toBeAdded);
                }

                // Return the newStatuses along with the original labels.
                return newStatuses.concat(labels);
            }

            function statusExists(status, labels) {
                return labels.some(function (label) {
                    return label.name === status.name;
                });
            }

            function applyStatus (labels, pr) {
                gh.issues.edit({
                    user: config.user,
                    repo: config.repo,
                    number: pr.number,
                    labels: labels
                }, logErrors);
            }

            // Bind to the events
            events.on('bot.pull_request.vote_started', function (pr) {
                var deferredLabels = getLabelsForPullRequest(pr);

                deferredLabels.then(function (labels) {
                    var newStatuses = removeStatuses([labelNames.rejected, labelNames.merged], labels);
                    newStatuses = addStatuses(labelNames.votingUnderway, labels);

                    applyStatus(newStatuses, pr);
                }, logErrors).done();
            });

            events.on('github.pull_request.closed', function (event) {
                var pr = event.pull_request;

                // Closed event fires for both merged and rejected scenarios, so
                // we must exit if the vote was successful and PR merged.
                if (pr.merged_at !== null) { return; }

                // Voting has rejected the PR.
                var deferredLabels = getLabelsForPullRequest(pr);

                deferredLabels.then(function (labels) {
                    var newStatuses = removeStatuses([labelNames.votingUnderway, labelNames.merged], labels);
                    newStatuses = addStatuses(labelNames.rejected, labels);

                    applyStatus(newStatuses, pr);
                }, logErrors).done();
            });

            events.on('github.pull_request.merged', function (event) {
                var pr = event.pull_request,
                    deferredLabels = getLabelsForPullRequest(pr);

                deferredLabels.then(function (labels) {
                    var newStatuses = removeStatuses([labelNames.rejected, labelNames.votingUnderway], labels);
                    newStatuses = addStatuses(labelNames.merged, labels);

                    applyStatus(newStatuses, pr);
                }, logErrors).done();
            });
        };
    });
}());
