(function() {
    var spawn = require('child_process').spawn;
    var exec = require('child_process').exec;
    var sleep = require('sleep');
    var pgrep = require('pgrep');

    var timeout = 5; // in seconds

    function failedToStart () {
        // Revert and stuff
    }

    function strip(s) {
        return s.replace(/^\s+|\s+$/g, '');
    }
    function startMain(code) {
        if (code !== 0) {
            return console.error('Failed to NPM install');
        }
        try {
            var child = spawn('node', [__dirname + "/main.js"], {
                detached: true,
                stdio: 'inherit'
            });
        } catch (ex) {
            console.log("Error: could not start main: "+ex);
            failedToStart ();
            return;
        }
        child.unref();
        sleep.sleep(timeout);


        child = exec('pgrep node',
                     function (error, stdout, stderr) {
                         var nNode = strip(stdout).split("\n").length;
                         if(nNode == 1) {
                             console.log("Error: bot is not running ");
                             failedToStart ();
                         }
                     });
    }

    function npmInstall() {
        var child = spawn('npm', ['install']);
        child.stderr.on('data', function (data) {
            console.error('npm install stderr: ' + data);
        });
        child.on('close', startMain);
    }

    npmInstall();
}());

