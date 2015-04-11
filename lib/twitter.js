var Twitter = require('twitter');
var Vault = require('./vault.js');

var client = new Twitter({
  consumer_key: Vault.get('twitter_consumer_key'),
  consumer_secret: Vault.get('twitter_consumer_secret'),
  access_token_key: Vault.get('twitter_token_key'),
  access_token_secret: Vault.get('twitter_token_secret')
});

var params = {screen_name: 'anythingbot'};

module.exports = {

	// Post the provided tweet to Twitter feed
	postTweet: function(tweet){
		client.post('statuses/update', {status: tweet},  function(error, tweetBody, response){
		  if(error) throw error;
		  console.log("Tweeted: " + tweet);
		});
	}

};
