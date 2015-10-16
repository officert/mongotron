'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const _ = require('underscore');
const async = require('async');
const Promise = require('bluebird');

const Connection = require('./connection');

const DB_CONNECTIONS = path.join(__dirname, '../config/dbConnections.json');

/**
 * @class ConnectionService
 */
class ConnectionService {
  /**
   * @constructor ConnectionService
   */
  constructor() {
    this._connections = []; //cache of Connection instances
  }

  /**
   * @method list
   */
  list(next) {
    next = next || function() {};

    var _this = this;

    return next(null, _this._connections);
  }

  /**
   * @method initializeConnections
   */
  initializeConnections() {
    var _this = this;

    return new Promise(function(resolve, reject) {

      async.waterfall([
        function getDbConfigsStep(done) {
          jsonfile.readFile(DB_CONNECTIONS, done);
        },
        function createConnectionsStep(fileData, done) {
          _generateConnectionInstancesFromConfig(fileData, done);
        }
      ], function(err, connections) {
        if (err) return reject(err);

        _this._connections = _this._connections.concat(connections);

        return resolve(null, _this._connections);
      });
    });
  }
}

function _generateConnectionInstancesFromConfig(configData, next) {
  var connections = [];

  //add the connection name
  for (var key1 in configData) {
    var connectionConfig = configData[key1];
    connectionConfig.name = key1;
  }

  var serverConfigGroups = _.groupBy(configData, function(c) {
    return [c.name, c.host, c.port].join('_');
  });

  for (var key2 in serverConfigGroups) {
    var databaseConfigs = serverConfigGroups[key2];

    if (!databaseConfigs || !databaseConfigs.length) continue;

    var connection = _createConnection(databaseConfigs);

    connections.push(connection);
  }

  return next(null, connections);
}

function _createConnection(databaseConfigs) {
  var firstConfig = databaseConfigs[0];

  var connection = new Connection({
    name: firstConfig.name,
    host: firstConfig.host,
    port: firstConfig.port,
    databaseConfigs: databaseConfigs
  });

  return connection;
}

/**
 * @exports
 */
module.exports = new ConnectionService();
