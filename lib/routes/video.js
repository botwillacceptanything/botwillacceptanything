(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'os',
        '../../config'
    ];

    
    function videoSeconds(video) {
        var vidHours = video[1];
        var vidMinutes = video[2];
        var vidSeconds = video[3];
        return vidSeconds + 60 * vidMinutes + 60 * 60 * vidHours;
    }


    define(deps, function (os, config) {
        function RouteVideo(app) {
            /**
             * Display a message if the webhooks are operational.
             */
            app.get('/video', function (req, res) {
                var videos = [
                    ['RQKp27ZDuCk',0, 4, 3],
                    ['qiKMmrG1ZKU',0, 8,55],
                    ['MsZtn29d52s',0,27,58],
                    ['2Ynn3mzC2E4',1,23,53],
                ];
                var totalSeconds = 0;
                // Compute duration of playlist
                var i;
                for (i = 0; i < videos.length; i += 1) {
                    totalSeconds += videoSeconds(videos[i]);
                }
                // Compute position in playlist
                var date = new Date();
                var seconds = date.getSeconds() + 60 * date.getMinutes() + 60 * 60 * date.getHours();
                seconds = seconds % totalSeconds;
                var playlistSeconds = seconds;
                // Compute current video
                for (i = 0; i < videos.length; i += 1) {
                    var vs = videoSeconds(videos[i]);
                    if (seconds < vs) {
                        break;
                    }
                    seconds -= vs;
                }
                // Report total length of 
                var tmpldata = {
                    data: {
                        vid : videos[i][0],
                        time : seconds,
                    }
                }
                res.render('video', tmpldata);
            });
        };

        module.exports = RouteVideo;
    });
}());

