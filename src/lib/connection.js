/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;
const util = require('util');

const Database = require('./database');
const errors = require('./errors');

/* ------------------------------------------------
 * Constructor
 * ------------------------------------------------ */
/* @constructor Connection
 * @param {Object} options
 * @param {String} options.name
 * @param {String} options.host
 * @param {String} options.port
 */
function Connection(options) {
  options = options || {};

  var _this = this;
  _this.name = options.name || 'local';
  _this.host = options.host || 'localhost';
  _this.port = options.port || 27017;
  _this.databaseConfigs = options.databaseConfigs || []; //database connection info
  _this.databases = []; //database instances
}

Connection.prototype.connect = function connect(next) {
  var _this = this;

  //when connect to a connection create all the database instances
  //if it's a local connection than get all the databases from the actual db
  //instead of from configs

  if (_this.host === 'localhost') {
    _this._getDbsForLocalhostConnection(next);
  } else {
    _.each(_this.databaseConfigs, function(config) {
      config.name = config.databasename;

      var existingDatabase = _.findWhere(_this.databases, {
        name: config.name
      });

      if (!existingDatabase) _this.addDatabase(config);
    });

    return next(null);
  }
};

Connection.prototype.addDatabase = function addDatabase(config) {
  config = config || {};

  var _this = this;

  var existingDatabase = _.findWhere(_this.databases, {
    name: config.name
  });

  config.name = config.name;

  if (existingDatabase) return;

  var database = new Database(config);

  _this.databases.push(database);

  return database;
};

Connection.prototype._getDbsForLocalhostConnection = function _getDbsForLocalhostConnection(next) {
  var _this = this;

  if (_this.host !== 'localhost') return next(new Error('cannot get local dbs for non localhost connection'));

  var localDb = new MongoDb('local', new MongoServer(_this.host, _this.port));

  localDb.open(function(err, db) {
    if (err) return next(new errors.ConnectionError(util.format('An errors occured when trying to connect to %s', _this.host)));

    // Use the admin database for the operation
    var adminDb = db.admin();

    // List all the available databases
    adminDb.listDatabases(function(err, result) {
      if (err) return next(new errors.DatabaseError(err));

      db.close();

      _.each(result.databases, function(db) {
        _this.addDatabase({
          name: db.name,
          host: _this.host,
          port: _this.port
        });
      });

      return next(null);
    });
  });
};

/* ------------------------------------------------
 * Private Helpers
 * ------------------------------------------------ */

/*
 * @exports
 *
 */
module.exports = Connection;
