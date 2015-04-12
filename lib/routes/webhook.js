(function() {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'crypto',
        '../events',
        '../../config'
    ];

    define(deps, function(crypto, events, config) {
        function signGitHubWebhookBlob(key, blob) {
            return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex');
        }

        function RouteWebhook(app) {
            app.post('/webhook/github', function (req, res) {
                var hash =  signGitHubWebhookBlob(config.githubAuth.webhookSecret, JSON.stringify(req.body));
                if (req.headers['x-hub-signature'] !== hash) {
                    res.status(500);
                    res.send('Failed. Invalid GitHub Webhook Signature');
                    return console.error('Received invalid GitHub Webhook Signature');
                }

                // Let GitHub know that everything came through.
                res.send('ok');

                var eventType = ['github'];
                if (typeof req.body.pull_request !== 'undefined') {
                    eventType.push('pull_request');
                } else if (typeof req.body.comment !== 'undefined') {
                    eventType.push('comment');
                } else if (req.body.ref === 'refs/heads/master' &&
                    typeof req.body.commits !== 'undefined') {
                    eventType.push('merge');
                } else {
                    // If we don't know the context of this event, don't emit it.
                    return;
                }

                if (typeof req.body.action !== 'undefined') {
                    eventType.push(req.body.action);
                }

                events.emit(eventType.join('.'), req.body);
            });
        };

        module.exports = RouteWebhook;
    });
}());