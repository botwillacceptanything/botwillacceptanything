(function () {
  var define = require('amdefine')(module);

  var deps = [
    'assert',
    'nock',

    '../mocks/twitter.js',
    '../../lib/integrations/twitter.js',
    '../../lib/events.js',
  ];

  define(deps, function (assert, nock, mock, twitter, events) {
    describe('twitter', function () {
      var mocked;
      var twitterInstance;
      beforeEach(function () {
        mocked = mock();
        twitterInstance = twitter();
      });
      afterEach(function () {
        twitterInstance.destroy();
        nock.cleanAll();
      });

      var mockEvent = {
        pull_request: {
          number: 1,
          title: 'Test Twitter functionality',
          html_url: 'http://example.com/',
        },
      };

      var mockMergeEvent = {
        pull_request: {
          number: 1,
          title: 'Test Twitter functionality',
          html_url: 'http://example.com/',
          merged_at: '2011-01-26T19:01:12Z',
        },
      };

      it('When a bot.pull_request.vote_started event occurs, it should tweet', function (done) {
        events.emit('bot.pull_request.vote_started', mockEvent.pull_request);
        setTimeout(function () {

          return mocked.isDone() ? done() : assert.ifError('Mocks not yet satisfied');
        }, 10);
      });

      it('When a github.pull_request.merged event occurs, it should tweet', function (done) {
        events.emit('github.pull_request.merged', mockMergeEvent);
        setTimeout(function () {
          return mocked.isDone() ? done() : assert.ifError('Mocks not yet satisfied');
        }, 10);
      });

      it('When a github.pull_request.closed event occurs, it should tweet', function (done) {
        events.emit('github.pull_request.closed', mockEvent);
        setTimeout(function () {
          return mocked.isDone() ? done() : assert.ifError('Mocks not yet satisfied');
        }, 10);
      });
    });
  });
}());
