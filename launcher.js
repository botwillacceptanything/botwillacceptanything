(function() {
    var spawn = require('child_process').spawn;
    var exec = require('child_process').exec;

    function startMain(code) {
        if (code !== 0) {
            return console.error('Failed to NPM install');
        }
        var child = spawn('node', [__dirname + "/main.js"], {
            detached: true,
            stdio: 'inherit'
        });
        child.unref();

        process.exit(0);
    }

    function npmInstall() {
        var child = spawn('npm', ['install']);
        child.stderr.on('data', function (data) {
            console.error('npm install stderr: ' + data);
        });
        child.on('close', startMain);
    }

    /**
     * Update data/authors.txt by running our shell script.
     */
    function updateAuthors(cb) {
      try {
        exec('./authors.sh', function (err, stdout, stderr) {
          if (err || stderr) {
            console.error('./authors.sh stderr:', err, stderr);
          }
        });
      }
      catch (e) {
        console.error('./authors.sh exception:' + e);
      }
      cb();
    }

    updateAuthors(npmInstall);
}());

