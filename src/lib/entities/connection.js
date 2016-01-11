'use strict';

const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');
const util = require('util');
const uuid = require('node-uuid');
const _ = require('underscore');

const logger = require('lib/modules/logger');
const Database = require('lib/entities/database');
const errors = require('lib/errors');

/**
 * @class Connection
 */
class Connection {
  /**
   * @constructor Connection
   *
   * @param {Object} options
   * @param {String} options.name
   * @param {String} [options.host]
   * @param {String} [options.port]
   * @param {Object} [options.replicaSet]
   * @param {String} [options.replicaSet.name]
   * @param {Array<Object>} [options.replicaSet.sets]
   */
  constructor(options) {
    options = options || {};

    var _this = this;
    _this.id = options.id;
    _this.name = options.name;
    _this.host = options.host;
    _this.port = options.port;
    _this.replicaSet = options.replicaSet;
    _this.databases = [];

    if (options.databaseName) {
      let newDb = {
        id: uuid.v4(),
        name: options.databaseName,
        host: options.host,
        port: options.port,
        auth: options.auth
      };

      if (options.auth && (options.auth.username || options.auth.password)) {
        newDb.auth = {};
        newDb.auth.username = options.auth.username;
        newDb.auth.password = options.auth.password;
      }

      _this.addDatabase(newDb);
    }
  }

  get connectionString() {
    if (!this._connectionString) {
      this._connectionString = _getConnectionString(this);
    }
    return this._connectionString;
  }

  /**
   * @method connect
   */
  connect() {
    var _this = this;

    return new Promise((resolve, reject) => {
      logger.log('Connecting to ' + _this.name + ' server @ ' + _this.connectionString + '...');

      let client = new MongoClient();

      if (!_this.connectionString) {
        return reject(new Error('connecting does have a connection string'));
      }

      client.connect(_this.connectionString, (err, database) => {
        if (err) return reject(new errors.ConnectionError(err.message));

        logger.log('Connected to ' + _this.name + ' server @ ' + _this.connectionString);

        if (_this.host === 'localhost') {
          _getDbsForLocalhostConnection(_this, () => {
            return resolve(null);
          });
        } else {
          return resolve(database);
        }
      });
    });
  }

  /**
   * @method addDatabase
   * @param {Object} options
   * @param {String} config.name
   */
  addDatabase(options) {
    options = options || {};

    var _this = this;

    var existingDatabase = _.findWhere(_this.databases, {
      name: options.name
    });

    if (existingDatabase) return;

    var database = new Database({
      id: options.id,
      name: options.name,
      host: options.host,
      port: options.port,
      auth: options.auth,
      connection: _this
    });

    _this.databases.push(database);

    return database;
  }
}

/**
 * @function _getDbsForLocalhostConnection
 * @param {Function} next - callback function
 */
function _getDbsForLocalhostConnection(connection, next) {
  if (!connection) return next(new Error('connection is required'));
  if (!next) return next(new Error('next is required'));
  if (connection.host !== 'localhost') return next(new Error('cannot get local dbs for non localhost connection'));

  var localDb = new MongoDb('local', new MongoServer(connection.host, connection.port));

  localDb.open(function(err, db) {
    if (err) return next(new errors.ConnectionError(util.format('An error occured when trying to connect to %s', connection.host)));

    // Use the admin database for the operation
    var adminDb = db.admin();

    // List all the available databases
    adminDb.listDatabases((err, result) => {
      if (err) return next(new errors.DatabaseError(err));

      db.close();

      _.each(result.databases, (db) => {
        connection.addDatabase({
          name: db.name,
          host: connection.host,
          port: connection.port
        });
      });

      return next(null);
    });
  });
}

function _getConnectionString(connection) {
  if (!connection) return null;

  let db = (connection.databases && connection.databases.length) ? connection.databases[0] : null;
  let auth = '';

  if (db && db.auth && db.auth.username && db.auth.password) {
    auth += (db.auth.username + ':' + db.auth.password + '@');
  }

  let connectionString = 'mongodb://';
  let hasReplSet = false;

  if (connection && connection.replicaSet && connection.replicaSet.name && (connection.replicaSet.sets && connection.replicaSet.sets.length)) {
    hasReplSet = true;

    connectionString += auth;

    for (let i = 0; i < connection.replicaSet.sets.length; i++) {
      let set = connection.replicaSet.sets[i];

      connectionString += set.host + ':' + set.port;

      if (i < (connection.replicaSet.sets.length - 1)) {
        connectionString += ',';
      }
    }
  } else {
    connectionString += auth + connection.host + ':' + connection.port;
  }

  if (db) connectionString += ('/' + db.name);

  if (hasReplSet) connectionString += '?replicaSet=' + connection.replicaSet.name;

  return connectionString;
}

/**
 * @exports
 */
module.exports = Connection;
