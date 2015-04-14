(function() {
  var ElizaBot = require('eliza/elizabot.js');

  var THREAD = {
    user: "botwillacceptanything",
    repo: "botwillacceptanything",
    number: 192
  }; // hardcoded as a central place for all forks to meet and talk

  // Export this module as a function
  module.exports = function(config, gh) {
    
    var eliza = new ElizaBot();
    
      // returns all results of a paginated function
    function getAllPages(cb, n, results) {
      if(!results) { results = []; }
      if(!n) { n = 0; }

      gh.issues.getComments({
        user: THREAD.user,
        repo: THREAD.repo,
        number: THREAD.number,
        page: n,
        per_page: 100

      }, function(err, res) {
        if(err || !res) { return cb(err); }

        results = results.concat(res);

        // if we got to the end of the results, return them
        if(res.length < 100) {
          return cb(null, results);
        }

        // otherwise keep getting more pages recursively
        getAllPages(cb, n+1, results);
      });
    }
  
    return {
      speak: function() {
        getAllPages(function(err, comments) {
          if (err || !comments) {
            return console.error('Error getting comments of talk thread.', err);
          }
        
          var msg = eliza.getInitial(), lastUser = '';
        
          for (var i=0; i < comments.length; i++) {
            if (comments[i].user.login !== config.user) {
              msg = eliza.transform(comments[i].body);
            }
            lastUser = comments[i].user.login;
          }
        
          if (lastUser !== config.user) {

            gh.issues.createComment({
              user: THREAD.user,
              repo: THREAD.repo,
              number: THREAD.number,
              body: msg
            });
          
          }
        });
      }
    };
  };
})();
