(function () {
    'use strict';

    var define = require('amdefine')(module);

    var deps = [
        'express',
        'http',
        'os',
        'ws',

        '../../config',
        '../../lib/sockets',
    ];

    define(deps, function (express, http, os, ws, config, sockets) {
        function ServiceStats(app) {
            var app = express();
            app.enable('trust proxy');
            var port = 3001;
            sockets.lookup['stats'] = port;
            var svcent = {};
            sockets[port] = svcent;
            svcent.wsmap = {};
            svcent.wsdata = {};
            svcent.counter = 1;

            var server = http.createServer(express());
            server.listen(port);
            
            var WebSocketServer = ws.Server;
            var wss = new WebSocketServer({server: server});
            wss.on('connection', function (ws) {
                var myid = svcent.counter;
                svcent.wsmap[myid] = ws;
                svcent.wsdata[myid] = {};
                svcent.wsdata[myid].inittime = Date.now();
                var id = setInterval(function () {
                    ws.send(JSON.stringify(
                            process.memoryUsage()), function () { });
                }, 250);
                console.log('started stats client interval for ws #' + myid);
                ws.on('close', function() {
                    console.log('stopping stats client interval for ws #' + myid);
                    clearInterval(id);
                    delete svcent.wsmap[myid];
                    delete svcent.wsdata[myid];
                });
                svcent.counter += 1;
            });
            
            
        };

        module.exports = ServiceStats;
    });
}());


