(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'os',
        '../../config',
        '../sockets',
    ];

    define(deps, function (os, config, sockets) {
        function RouteHello(app) {
            app.get('/hello', function (req, res) {
                var nws = 0;
                var helloport = sockets.lookup['hello'];
                var svcent = sockets[helloport];
                Object.keys(svcent.wsmap).forEach(function (wsid) {
                    if (svcent.wsmap[wsid] == null) {
                        return;
                    }
                    nws += 1;
                });
                var data = {nws : nws};
                var tmpldata = {
                    data: data,
                    layout: 'hello'
                }
                res.render('hello', tmpldata);
            });
        };

        module.exports = RouteHello;
    });
}());

