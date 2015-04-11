(function() {
    'use strict';

    var fs = require('fs');

    var mustache = require('mustache');

    var TEMPLATES = '../templates';

    var templates = {};

    var load = function(template) {
        if (templates[template] === undefined) {
            var filename = require('path').join(__dirname, TEMPLATES, template);
            templates[template] = fs.readFileSync(filename, 'utf8');
        }

        return templates[template];
    };

    module.exports = {
        render: function(template, view) {
            template = load(template);
            return mustache.render(template, view);
        }
    };
}());
