(function() {
    var define = require('amdefine')(module);

    var deps = [
        'assert',

        '../../config.template.js'
    ];

    define(deps, function(assert, config) {
        describe('config', function(){
            describe('webserver', function(){
                it('should return 3000 as port number', function(){
                    assert.equal(config.webserver.port, 3000);
                })
            });

            describe('githubAuth', function(){
                it('Has github section in config', function(){
                    assert.equal(!!config.githubAuth, true);
                })
            });
        })
    });
}());