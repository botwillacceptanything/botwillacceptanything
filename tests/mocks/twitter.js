(function () {
  'use strict';

  var define = require('amdefine')(module);

  var deps = [
    'nock',
  ];

  define(deps, function (nock) {
    module.exports = function () {
      nock('https://api.twitter.com')
        .persist()
        .post('/1.1/statuses/update.json')
        .reply(200, {
          id_str: '123456789012345678',
          created_at: "Wed Sep 05 00:37:15 +0000 2012",
        });
    }
  });
}());
