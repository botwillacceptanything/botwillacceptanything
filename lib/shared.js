(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'sanitize-html'
    ];

    define(deps, function (sanitizeHtml) {
        module.exports = {
            sanitizeAllHtml: function (dirty) {
                return sanitizeHtml(dirty, {allowedTags: []});
            }
        };
    });
}());

