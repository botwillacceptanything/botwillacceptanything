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
        function ServiceHello(app) {
            var app = express();
            app.enable('trust proxy');
            var port = 3010;
            sockets.lookup['hello'] = port;
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
                console.log('started hello for ws #' + myid);
                ws.on('close', function() {
                    console.log('stopping hello for ws #' + myid);
                    delete svcent.wsmap[myid];
                    delete svcent.wsdata[myid];
                });
                ws.on('message', function(data, flags) {
                    console.log('receiving hello from client for ws #' + myid);
                    console.log('DEBUG: ' + data);
                    data = JSON.parse(data);
                    var d = {content: 'a client said: ' + data.content};
                    if (data.broadcast) {
                        Object.keys(svcent.wsmap).forEach(function (wsid) {
                            if (svcent.wsmap[wsid] == null) {
                                return;
                            }
                            svcent.wsmap[wsid].send(
                                JSON.stringify(d), function () { });
                        });
                    } else {
                        ws.send(JSON.stringify(d), function () { });
                    }
                });
                svcent.counter += 1;
            });
        };

        module.exports = ServiceHello;
    });
}());


