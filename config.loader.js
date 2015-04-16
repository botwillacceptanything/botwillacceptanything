(function () {
  'use strict';

  var define = require('amdefine')(module);
  var fs = require('fs');
  var fse = require('fs-extra');

  var deps = [
    './configs/custom.js',
    'lodash',
    './config.template.js',
  ];

  var err;

  // If configs/custom.js exists, load it immediately. We don't need to
  // restructure the configs.
  if (fs.existsSync('./configs/custom.js') === true) {
    if (fs.existsSync('./config.js') === false) { updateLoader(); }
    return prepareConfig();
  }

  // If config.js doesn't exist right now, copy the template.
  if (fs.existsSync('./config.js') === false) {
    fse.copySync('./config.template.js', './configs/custom.js');
  } else {
    // Otherwise, move the current config into the correct location.
    err = fs.renameSync('./config.js', './configs/custom.js');
    // If an error occurred, load the original config.js.
    if (err) {
      console.error(err);
      console.error(err.stack);
      deps[0] = './config.js';
      return prepareConfig();
    }
  }

  // Update the loader and then prepare the config for merging.
  updateLoader();
  prepareConfig();

  function updateLoader() {
    // Copy this loader into config.js for backwards compatibility.
    err = fse.copySync(__filename, './config.js');
    if (err) {
      console.error(err);
      console.error(err.stack);
    }
  }

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
