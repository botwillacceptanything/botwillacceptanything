(function () {
  'use strict';

  var config = require('../config.js');
  var Github = require('github');
  var _ = require('lodash');

  var gh = new Github({
    version: '3.0.0',
    headers: {
      'User-Agent': config.user + '/' + config.repo
    }
  });
  gh.authenticate(config.githubAuth);

  /**
   * Provide a function for getting all pages of an API request.
   */
  gh.getAllPages = function getAllPages(repo, f, cb, n, results) {
    if (!results) { results = []; }
    if (!n) { n = 0; }

    var repoRequest = _.merge({}, repo, {
      page: n,
      per_page: 100,
    });

    f(repoRequest, function (err, res) {
      if (err || !res) { return cb(err); }

      results = results.concat(res);

      // if we got to the end of the results, return them
      if (res.length < 100) {
        return cb(null, results);
      }

      // otherwise keep getting more pages recursively
      getAllPages(repo, f, cb, n + 1, results);
    });
  };

  module.exports = gh;
}());
