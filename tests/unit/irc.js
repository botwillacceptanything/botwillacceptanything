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

    // Bootstrap a new test of the IRC client.
    function bootstrapTest() {
      var mock = ircMocks.MockIrcd(6667, 'utf-8', false);
      mock.server.on('connection', function() {
        mock.send(greeting);
        mock.send(motd);
      });
      mock.on('end', function () {
        mock.close();
      });
      return mock;
    }

    describe('irc', function () {
      it('The bot should connect to IRC', function (done) {
        bootstrapTest();
        var client = irc();
        client.on('registered', function () {
          client.disconnect();
          done();
        });
      });

      it('The bot should join the correct channel', function (done) {
        var mock = bootstrapTest();
        var client = irc();
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
        var mock = bootstrapTest();
        var client = irc();
        client.on('registered', function () {
          events.emit('bot.pull_request.vote_started', mockEvent.pull_request);
          setTimeout(function () { client.disconnect(); }, 0);
        });
        mock.on('end', function () {
          var msgs = mock.getIncomingMsgs();
          if (msgs.filter(function (line) {
            return (line.indexOf('PRIVMSG ' + config.irc.channel) !== -1);
          }).length === 1) {
            done();
          }
          assert.ifError('Message not sent');
        });
      });

      it('When a github.pull_request.closed event occurs, it should speak', function (done) {
        var mock = bootstrapTest();
        var client = irc();
        client.on('registered', function () {
          events.emit('github.pull_request.closed', mockEvent);
          setTimeout(function () { client.disconnect(); }, 0);
        });
        mock.on('end', function () {
          var msgs = mock.getIncomingMsgs();
          if (msgs.filter(function (line) {
            return (line.indexOf('PRIVMSG ' + config.irc.channel) !== -1);
          }).length === 1) {
            done();
          }
          assert.ifError('Message not sent');
        });
      });

      it('When a github.pull_request.merged event occurs, it should speak', function (done) {
        var mock = bootstrapTest();
        var client = irc();
        client.on('registered', function () {
          events.emit('github.pull_request.merged', mockEvent);
          setTimeout(function () { client.disconnect(); }, 0);
        });
        mock.on('end', function () {
          var msgs = mock.getIncomingMsgs();
          if (msgs.filter(function (line) {
            return (line.indexOf('PRIVMSG ' + config.irc.channel) !== -1);
          }).length === 1) {
            done();
          }
          assert.ifError('Message not sent');
        });
      });
    });
  });
}());
