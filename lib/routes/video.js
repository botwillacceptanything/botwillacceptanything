(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'os',
        '../../config'
    ];

    define(deps, function (os, config) {
        function RouteVideo(app) {
            /**
             * Display a message if the webhooks are operational.
             */
            app.get('/video', function (req, res) {
                var date = new Date();
                var seconds = date.getSeconds() + 60 * date.getMinutes() + 60 * 60 * date.getHours();
                seconds = seconds % 1678;
                var tmpldata = {
                    data: {
                        vid : 'MsZtn29d52s',
                        time : seconds,
                    }
                }
                res.render('video', tmpldata);
            });
        };

        module.exports = RouteVideo;
    });
}());

