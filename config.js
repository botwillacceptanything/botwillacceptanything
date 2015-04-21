(function () {
  'use strict';

  var define = require('amdefine')(module);
  var fs = require('fs');
  var fse = require('fs-extra');

  var deps = [
    './configs/custom.js',
    'lodash',
    './configs/template.js',
  ];

  var err;

  // If configs/custom.js doesn't exist right now, copy the template.
  if (fs.existsSync('./configs/custom.js') === false) {
    fse.copySync('./configs/template.js', './configs/custom.js');
  }

  // Update the loader and then prepare the config for merging.
  prepareConfig();

  function prepareConfig() {
    var exists = fs.existsSync('./configs/' + process.env.BUILD_ENVIRONMENT + '.js');

    if (exists === true) {
      deps.push('./configs/' + process.env.BUILD_ENVIRONMENT + '.js');
    }
    mergeConfig();
  }

  function mergeConfig() {
    define(deps, function (config, _, template, env) {
      if (typeof env === 'undefined') { env = {}; }
      _.merge(template, config, env);
      module.exports = template;
    });
  }
}());
