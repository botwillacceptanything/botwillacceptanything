(function () {
  'use strict';

  var config = require('../config.js');
  var sqlite3 = require('sqlite3').verbose();
  var _ = require('underscore');

  var db_no_export = new sqlite3.Database(config.db.sqlite.name, function(err) {
    var handleError = function(err) {
      if (err) {
        console.error(err);
        console.error(err.stack);
      }
      return err;
    }
    if (err) return handleError(err);

    var exports = {};

    // TODO: find a way to extract things into modules, while forcing people to not export the db.

    // karma
    db_no_export.run('CREATE TABLE IF NOT EXISTS $table (' +
                     '  identity TEXT PRIMARY KEY UNIQUE NOT NULL ON CONFLICT FAIL,' +
                     '  score INTEGER NOT NULL ON CONFLICT FAIL)',
                     {'$table': config.db.sqlite.tables.karma},
                     handleError);
    var addKarma = function (name, delta, cb) {
      // varargs
      if (_.isFunction(delta)) {
        cb = delta;
        delta = 1;
      }
      if (!_.isFunction(cb)) {
        cb = _.noop;
      }
      if (_.isUndefined(delta)) {
        delta = 1;
      }

      // validation
      if (name.length == 0) {
        return cb(handleError(new Error("addKarma was called for an empty name.")));
      }
      if (!_.isNumber(delta)) {
        return cb(handleError(new Error("addKarma was called with a non-number delta.")));
      }

      var params = {
        '$table': config.db.sqlite.tables.karma,
        '$name': name,
        '$delta': delta
      };

      // TODO: assert name is a string;
      db_no_export.run(
          'INSERT OR IGNORE INTO $table (identity, score) values ($name, 0)',
          params,
          function(err) {
            if (err) return cb(handleError(err));
            db_no_export.run(
              'UPDATE $table SET score = (score + $delta) where identity = $name',
              params,
              function(err) {
                return cb(handleError(err), this);
              });
          }
      );
    }
    var getKarma = function(name, cb) {
      if (!_.isFunction(cb)) {
        cb = _.noop;
      }
      if (!_.isString(name)) {
        return cb(handleError(new Error("getKarma was called with a non-string name.")));
      }
      var params = {
        '$table': config.db.sqlite.tables.karma,
        '$name': name
      };
      db_no_export.get(
        'select * from $table where identity = $name limit 1',
        params,
        function(err) {
          return cb(handleError(err), this);
        });
    }

    exports.karma = {
      addKarma: addKarma,
      getKarma: getKarma,
    };

    // Please don't export the database. Write methods that do things to it. It'll be cleaner.
    module.exports = exports;

  });
}());
