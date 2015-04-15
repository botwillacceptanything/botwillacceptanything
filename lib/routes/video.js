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
                var date = new Date();
                var secondsPastMidnight = date.getSeconds() + 60 * date.getMinutes() + 60 * 60 * date.getHours();
                var x = media.getMediaAt(secondsPastMidnight % media.grandTotalSeconds);
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

