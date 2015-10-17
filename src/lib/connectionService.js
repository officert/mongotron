'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const _ = require('underscore');
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
    this._initialized = false;
  }

  /**
   * @method list
   */
  list() {
    var _this = this;

    if (_this._initialized) {
      return new Promise(function(resolve) {
        return resolve(_this._connections);
      });
    } else {
      return readConfigFile()
        .then(_generateConnectionInstancesFromConfig)
        .then(function(connections) {
          return new Promise(function(resolve) {
            _this._connections = _this._connections.concat(connections);
            _this._initialized = true;
            return resolve(_this._connections);
          });
        });
    }
  }
}

function readConfigFile() {
  return new Promise(function(resolve, reject) {
    jsonfile.readFile(DB_CONNECTIONS, function(err, data) {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

function _generateConnectionInstancesFromConfig(configData) {
  return new Promise(function(resolve) {
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

    return resolve(connections);
  });
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
