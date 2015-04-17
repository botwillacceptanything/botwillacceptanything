(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'os',
        '../../config',
        '../../lib/media',
    ];

    define(deps, function (os, config,media) {
        function RouteVideo(app) {
            /**
             * Display a message if the webhooks are operational.
             */
            app.get('/video', function (req, res) {
                // Compute duration of playlist
                // Use UTC so bots are in sync globally
                //
                var now = new Date(); 
                var now_utc = new Date(now.getUTCFullYear(),
                    now.getUTCMonth(), now.getUTCDate(),
                    now.getUTCHours(), now.getUTCMinutes(),
                    now.getUTCSeconds());
                console.log(now_utc);
                var secondsPastMidnightUTC = now_utc.getSeconds() + 60 *
                    now_utc.getMinutes() + 60 * 60 * now_utc.getHours();
                var x = media.getMediaAt(secondsPastMidnightUTC %
                    media.grandTotalSeconds);
                var mediaItem = x[0];
                var secondsInto = x[1];
                // console.log(mediaItem);
                var data = {};
                if (mediaItem.type == "youtube") {
                    data.mediaIsVideo = 1;
                    data.mediaIsMusic = 0;
                    data.mid = mediaItem.mid;
                    data.time = secondsInto;
                } else if (mediaItem.type == "soundcloud") {
                    data.mediaIsVideo = 0;
                    data.mediaIsMusic = 1;
                    data.mid = mediaItem.mid;
                    data.time = secondsInto;
                }
                // console.log(data);
                var tmpldata = {
                    data: data,
                    layout: 'media',
                }
                res.render('video', tmpldata);
            });
        };

        module.exports = RouteVideo;
    });
}());

