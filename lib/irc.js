module.exports = function(config) {
  if(!config.irc) {
    console.error('No IRC settings in config. IRC bot disabled.');
    return null;
  }

  console.log('Enabling IRC bot...');
  var irc = require('irc');

  var client = new irc.Client('irc.freenode.net', config.irc.user, {
    channels: [ config.irc.channel ]
  });
  client.on('error', function(err) {
    console.error('IRC ERROR: ' + JSON.stringify(err));
  });

  return client;
};
