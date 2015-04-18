(function () {
  'use strict';

  var config = require('../config.js');
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(config.db.sqlite.name);

  module.exports = {
    db: db
  }
}());
