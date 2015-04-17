(function () {
  var define = require('amdefine')(module);

  var deps = [
    'assert',
    'deferred',
    'irc/test/helpers.js',

    '../../config.js',
    '../../lib/integrations/irc.js',
    '../../lib/events.js',
  ];

  define(deps, function (assert, deferred, ircMocks, config, irc, events) {
    var greeting = ':localhost 001 testbot:Welcome to the Internet Relay Chat Network testbot\r\n';
    var motd = ':localhost 422 testbot:\r\n';

    var mockEvent = {
      pull_request: {
        number: 1,
        title: 'Test PR',
        html_url: 'http://example.com',
        merged_at: null,
        user: {
          login: 'TestAuthor',
        },
      },
    };

    describe('irc', function () {
      var mock;
      var ircSetup;
      var client;
      var ircDestroy;

      beforeEach(function () {
        mock = ircMocks.MockIrcd(6667, 'utf-8', false);
        mock.server.on('connection', function() {
          mock.send(greeting);
          mock.send(motd);
        });
        mock.on('end', function () {
          mock.close();
        });

        ircSetup = irc();
        client = ircSetup.client;
        ircDestroy = ircSetup.destroy;
      });
      afterEach(function () {
        ircDestroy();
      });

      function assertOnePrivateMessage(done) {
        var msgs = mock.getIncomingMsgs();
        var matchingMessages = msgs.filter(function (line) {
          return (line.indexOf('PRIVMSG ' + config.irc.channel) !== -1);
        });
        if (matchingMessages.length === 1) {
          done();
        } else if (matchingMessages.length > 1) {
          assert.ifError('Too many messages sent');
        }
        assert.ifError('Message not sent');
      }

      it('The bot should connect to IRC', function (done) {
        client.on('registered', function () {
          client.disconnect(done);
        });
      });

      it('The bot should join the correct channel', function (done) {
        client.on('registered', function () {
          setTimeout(function () { client.disconnect(); }, 0);
        });
        mock.on('end', function () {
          var msgs = mock.getIncomingMsgs();
          if (msgs.indexOf('JOIN ' + config.irc.channel) !== -1) {
            done();
          }
          assert.ifError('Channel not joined');
        });
      });

      it('When a bot.pull_request.vote_started event occurs, it should speak', function (done) {
        client.on('registered', function () {
          events.emit('bot.pull_request.vote_started', mockEvent.pull_request);
          setTimeout(function () { client.disconnect(); }, 0);
        });
        mock.on('end', assertOnePrivateMessage.bind(null, done));
      });

      it('When a github.pull_request.closed event occurs, it should speak', function (done) {
        client.on('registered', function () {
          events.emit('github.pull_request.closed', mockEvent);
          setTimeout(function () { client.disconnect(); }, 0);
        });
        mock.on('end', assertOnePrivateMessage.bind(null, done));
      });

      it('When a github.pull_request.merged event occurs, it should speak', function (done) {
        client.on('registered', function () {
          events.emit('github.pull_request.merged', mockEvent);
          setTimeout(function () { client.disconnect(); }, 0);
        });
        mock.on('end', assertOnePrivateMessage.bind(null, done));
      });
    });
  });
}());
