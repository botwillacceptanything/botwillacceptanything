(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'deferred',
    'fs',
    'path',
    'nock',

    '../../config.js',
    '../../lib/logger',
  ];

  define(deps, function (deferred, fs, path, nock, config, Logger) {
    module.exports = function () {
      nock.enableNetConnect();

      if (typeof config.mocks === 'undefined') { return deferred(1); }

      var d = deferred(1);

      Logger.log('Initializing mocks.');

      Object.keys(config.mocks)
        .filter(function (mock) {
          return config.mocks[mock] == true;
        })
        .map(function (mock) {
          var filePath = path.join(__dirname, mock + '.js');
          Logger.info('Loading ' + filePath);
          d.then(function () { require(filePath)(); });
        });

      d.then(d.resolve,
        function (err) {
          Logger.error(err);
          Logger.error(err.stack);
        });

      return d;
    }
  });
}());
