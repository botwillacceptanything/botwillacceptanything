(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'nock',
  ];

  define(deps, function (nock) {
    module.exports = function () {
      return nock('https://thecatapi.com')
        .get('/api/images/get?format=html')
        .reply(200, '');
    };
  });
}());
