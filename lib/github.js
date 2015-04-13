(function () {
  'use strict';

  var config = require('../config.js');
  var Github = require('github');

  var gh = new Github({
    version: '3.0.0',
    headers: {
      'User-Agent': config.user + '/' + config.repo
    }
  });
  gh.authenticate(config.githubAuth);

  module.exports = gh;
}());
