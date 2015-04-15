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
            var d = deferred(),
                statusLabels = requiredLabels.asArray();

            function logErrors(err) {
                console.error(err);
            }

            function init () {
                // Get all the current repo labels, then
                // ensure that our special status labels have
                // been created.
                // Chains a done() call for error safety as
                // recommended here:
                //   https://www.npmjs.com/package/deferred#ending-chain
                getRepoLabels()
                    .then(ensureStatusLabelsCreated, logErrors)
                    .done();
            }

            function getRepoLabels () {
                var deferredRepoLabels = deferred();

                gh.issues.getLabels({
                    user: config.user,
                    repo: config.repo
                }, function (err, repoLabels) {
                    if (err) {
                        deferredRepoLabels.reject(err);
                    }

                    deferredRepoLabels.resolve(repoLabels);
                });

                return deferredRepoLabels.promise();
            }

            function ensureStatusLabelsCreated (repoLabels) {
                var deferredLabels = [];

                // Iterate over the status labels we need
                // and create any that did not already exist
                // in the repo.
                // Store the create label promises into an array.
                statusLabels.forEach(function (statusLabel) {
                    if(!statusExists(statusLabel, repoLabels)) {
                        deferredLabels.push(createStatusLabel(statusLabel));
                    }
                });

                if (deferredLabels.length === 0) {
                    d.resolve(repoLabels);
                    return;
                }

                // Group all of the create label promises, so that we
                // only resolve when everything has been completed.
                deferred.apply({}, deferredLabels)(function (resultArray) {
                    var allRepoLabels = repoLabels.concat(resultArray);

                    d.resolve(allRepoLabels);
                }, logErrors);
            }

            function statusExists(status, labels) {
                return labels.some(function (label) {
                    return label.name === status.name;
                });
            }

            function createStatusLabel(statusLabel) {
                var deferredCreateLabel = deferred();

                gh.issues.createLabel({
                    user: config.user,
                    repo: config.repo,
                    name: statusLabel.name,
                    color: statusLabel.color
                }, function (err, createdLabel) {
                    if (err) {
                        deferredCreateLabel.reject(err);
                    }

                    // Resolve with the newly created label
                    deferredCreateLabel.resolve(createdLabel);
                });

                return deferredCreateLabel.promise();
            }

            init();

            return d.promise();
        };
    });
}());
