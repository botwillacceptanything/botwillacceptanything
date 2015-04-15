(function () {
  var define = require('amdefine')(module);

  var deps = [
    'assert',

    '../mocks/',
    '../../lib/integrations/twitter.js',
    '../../lib/events.js',
  ];

  define(deps, function (assert, mocks, twitter, events) {
    var mockList;
    // Wait for all of the mocks to be loaded.
    mocks()
      .then(function (loadedMocks) {
        mockList = loadedMocks;
        return twitter();
      }).then(function () {
        describe('twitter', function () {
          var mockEvent = {
            pull_request: {
              number: 1,
              title: 'Test Twitter functionality',
              html_url: 'http://example.com/',
            },
          };
          it('When a bot.pull_request.vote_started event occurs, it should tweet', function () {
            events.emit('bot.pull_request.vote_started', mockEvent.pull_request);
            setTimeout(function () {
              mockList.twitter.done();
              mockList.twitter.cleanAll();
            }, 0);
          });

          it('When a github.pull_request.merged event occurs, it should tweet', function () {
            events.emit('github.pull_request.merged', mockEvent);
            setTimeout(function () {
              mockList.twitter.done();
              mockList.twitter.cleanAll();
            }, 0);
          });

          it('When a github.pull_request.closed event occurs, it should tweet', function () {
            events.emit('github.pull_request.closed', mockEvent);
            setTimeout(function () {
              mockList.twitter.done();
              mockList.twitter.cleanAll();
            }, 0);
          });
        });
    });
  });
}());
