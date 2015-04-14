(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        '../github',
        '../../config',
        '../events'
    ];

    define(deps, function (gh, config, events) {
        module.exports = function () {
            var VOTING_UNDERWAY = 'Voting Underway',
                VOTING_REJECTED = 'Rejected',
                VOTING_MERGED = 'Merged',
                voteStatusLabels = [
                    { name: VOTING_UNDERWAY, color: '8AEBC9' },
                    { name: VOTING_REJECTED, color: 'FF6333' },
                    { name: VOTING_MERGED, color: '88C451' }
                ];

            gh.issues.getLabels({
                user: config.user,
                repo: config.repo
            }, function (err, repoLabels) {
                ensureRepoHasLabels(voteStatusLabels, repoLabels);
            });

            events.on('bot.pull_request.vote_started', function (pr) {
                setPrStatusLabel(getStatusLabel(VOTING_UNDERWAY), pr);
            });

            events.on('github.pull_request.closed', function (event) {
                var pr = event.pull_request;

                // Closed event fires for both merged and rejected scenarios, so
                // we must exit if the vote was successful and PR merged.
                if (pr.merged_at !== null) { return; }

                // Voting has rejected the PR.
                setPrStatusLabel(getStatusLabel(VOTING_REJECTED), pr);
            });

            events.on('github.pull_request.merged', function (event) {
                var pr = event.pull_request;

                setPrStatusLabel(getStatusLabel(VOTING_MERGED), pr);
            });

            function noop(err) {
                if (err) console.error(err);
            }

            function getStatusLabel(labelName) {
                var indexOfLabel = voteStatusLabels.map(function (label) {
                    return label.name;
                }).indexOf(labelName);

                if (indexOfLabel < 0) {
                    throw 'No status label with the name \'' + labelName + '\' was found.';
                }

                return voteStatusLabels[indexOfLabel];
            }

            function setPrStatusLabel(label, pr) {
                // Fetch the issue labels for this pull request
                gh.issues.getIssueLabels({
                    user: config.user,
                    repo: config.repo,
                    number: pr.number
                }, function (err, prLabels) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Sanity check for label we are trying to set:
                    if (containsLabel(label, prLabels)) {
                        // Label is already on the PR, nothing to do.
                        return;
                    }

                    // Remove any status labels that are not what we want to apply to the PR
                    if (label.name === VOTING_UNDERWAY) {
                        prLabels = removeUnwantedLabels([
                            getStatusLabel(VOTING_MERGED),
                            getStatusLabel(VOTING_REJECTED)
                        ], prLabels);

                    } else if (label.name === VOTING_REJECTED) {
                        prLabels = removeUnwantedLabels([
                            getStatusLabel(VOTING_MERGED),
                            getStatusLabel(VOTING_UNDERWAY)
                        ], prLabels);

                    } else if (label.name === VOTING_MERGED) {
                        prLabels = removeUnwantedLabels([
                            getStatusLabel(VOTING_REJECTED),
                            getStatusLabel(VOTING_UNDERWAY)
                        ], prLabels);

                    }

                    // Add the status label that we want
                    prLabels.push(label);

                    applyNewPrLabels(prLabels, pr);
                });
            }

            function removeUnwantedLabels(labelsToRemove, prLabels) {
                // Filter the pull request labels, only keeping the ones that are no in labelsToRemove
                return prLabels.filter(function (prLabel) {
                    return !(containsLabel(prLabel, labelsToRemove));
                });
            }

            function applyNewPrLabels(prLabels, pr) {
                gh.issues.edit({
                    user: config.user,
                    repo: config.repo,
                    number: pr.number,
                    labels: prLabels
                }, noop);
            }

            // Create any labels that haven't already been created.
            // If all required labels already exist in the repo, this will do nothing.
            function ensureRepoHasLabels (requiredLabels, repoLabels) {
                var toCreate = findLabelsToCreate(requiredLabels, repoLabels);

                toCreate.forEach(function (requiredLabel, index) {
                    // Repo doesn't have this label. Create it.
                    gh.issues.createLabel({
                        user: config.user,
                        repo: config.repo,
                        name: requiredLabel.name,
                        color: requiredLabel.color
                    }, noop);
                });
            }

            // Returns an array of labels that we want to use, but which do not currently exist in the repo.
            function findLabelsToCreate(requiredLabels, repoLabels) {
                // Filter the labels we need, by the ones that already exist in the repo.
                // Return any that do not exist in the repo.
                return requiredLabels.filter(function (label) {
                    // If the label doesn't exist in the repo already, keep it.
                    return !(containsLabel(label, repoLabels));
                });
            }

            // Returns true if a specific label is contained in a given array of labels.
            function containsLabel(labelToFind, labelArray) {
                return labelArray.some(function (label) {
                    return label.name === labelToFind.name;
                });
            }
        };
    });
}());
