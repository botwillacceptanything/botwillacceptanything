(function() {
  // If no env is set yet, set it to development.
  if (typeof process.env.BUILD_ENVIRONMENT === 'undefined') {
    process.env.BUILD_ENVIRONMENT = 'development';
  }

  var cli = require("cline")();
  var scheme = require("biwascheme");

  function scm_parse(string) {
    var i;
    var result = [[]];
    var tokenbuf = [];
    function flush_tokenbuf() {
      if (tokenbuf.length > 0) {
        result[result.length-1].push(tokenbuf.join(""));
        tokenbuf = [];
      }
    }
    for (i = 0; i < string.length; i += 1) {
      var c = string[i];
      if (c == '(') {
        result.push([]);
      } else if (c == ')') {
        flush_tokenbuf();
        var newcom = result.splice(result.length-1)[0];
        result[result.length-1].push(newcom);
      } else if (c == ' ') {
        flush_tokenbuf();
      } else {
        tokenbuf.push(c);
      }
    }
    flush_tokenbuf();
    return result[0];
  }

  function main() {
    scheme.run_file('ch4-query.scm');
    scheme.run("(initialize-data-base microshaft-data-base)");
    cli.history([]);
    cli.prompt("? ");
    cli.on('history', function (ans) {
      if (ans != "") {
        try {
          scheme.run("(define the-query-pat (query-syntax-process '" + ans + "))");
          scheme.run("(qeval-1 the-query-pat)");
        } catch (e) {
          console.log(e);
        }
      }
      cli.prompt("? ");
    });
  }
  main();

  process.on('uncaughtException', function (err) {
    console.error('UNCAUGHT ERROR: ' + err + '\n' + err.stack);
  });
}());
