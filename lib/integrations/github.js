(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        './github/createLabels',
        './github/autoLabeller',
        './github/requiredLabels'
    ];

    define(deps, function (createLabels, autoLabeller, requiredLabels) {
        module.exports = function () {
            // Create the labels
            createLabels(requiredLabels.asArray()).then(function (repoLabels) {
                // At this point, all the required labels have definitely been created.
                // repoLabels is an array of all current repository labels, including
                // the ones that have just been created.
                // We do not really need repoLabels for anything at this stage,
                // but may in future.
                // As far as autoLabeller is concerned, the label is assumed to exist.
                // Therefore, any label applied by autoLabeller should have its name
                // in requiredLabels.js.

                // Add hooks for auto labelling pull requests.
                autoLabeller(requiredLabels.names);
            });
        };
    });
}());
