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

  var exists = fs.existsSync('./configs/custom.js');
  if (exists === true) { return prepareConfig(); }

  err = fs.renameSync('./config.js', './configs/custom.js');
  // If an error occurred, load the original config.js.
  if (err) {
    console.error(err);
    console.error(err.stack);
    deps[0] = './config.js';
    return prepareConfig();
  }

  err = fse.copySync(__filename, './config.js');
  if (err) {
    console.error(err);
    console.error(err.stack);
  }
  prepareConfig();

  function prepareConfig() {
    var exists = fs.existsSync('./configs/' + process.env.BUILD_ENVIRONMENT + '.js');

    console.log(process.env.BUILD_ENVIRONMENT);
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
