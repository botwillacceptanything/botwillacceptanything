(function() {
    var express = require('express');
    var favicon = require('serve-favicon');
    var bodyParser = require('body-parser');
    var app = express();
    var os = require('os');

    var git = require('gift');
    var sanitizeHtml = require('sanitize-html');
    var interceptStdout = require('intercept-stdout');
    var crypto = require('crypto');

    var util = require('util');
    var Vault = require('./vault.js');
    Vault.read();

// Record a log of all stdout.
    var stdoutLog = [];
    var unhookStdout = interceptStdout(function (message) {
        // There is a bug in intercept-stdout that double-prints console.error
        // messages. This will ignore the incorrectly formatted one.
        if (message.indexOf("[ '[ERROR]") === 0) {
            return;
        }
        stdoutLog.push(message);
    });

    function sanitizeAllHtml(dirty) {
        return sanitizeHtml(dirty, {allowedTags: []});
    }

    module.exports = function (config, events) {
        var server = app.listen(3000);
        app.use(bodyParser.json());


        app.use(favicon(__dirname + '/../data/favicon.ico'));

        function signGitHubWebhookBlob(key, blob) {
            return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex');
        }




    };
}());
