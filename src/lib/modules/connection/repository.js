'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const _ = require('underscore');
const Promise = require('bluebird');

const Connection = require('lib/entities/connection');

const DB_CONNECTIONS = path.join(__dirname, '../../../', 'config/dbConnections.json');

/**
 * @class ConnectionRepository
 */
class ConnectionRepository {
  /**
   * @constructor ConnectionRepository
   */
  constructor() {}

  /**
   * @method create
   */
  create() {
    //  var _this = this;
  }

  /**
   * @method list
   */
  list() {
    return readConfigFile()
      .then(generateConnectionInstancesFromConfig);
  }

  /**
   * @method delete
   * @param {String} id - id of the connection to delete
   */
  delete(id) {
    var _this = this;

    return removeConnection(id, _this._connections)
      .then(writeConfigFile);
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

function writeConfigFile(data) {
  return new Promise(function(resolve, reject) {
    jsonfile.writeFile(DB_CONNECTIONS, data, function(err, data) {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

function generateConnectionInstancesFromConfig(connectionConfigs) {
  return new Promise(function(resolve) {
    var connections = [];

    _.each(connectionConfigs, function(connectionConfig) {
      var newConn = new Connection({
        name: connectionConfig.name,
        host: connectionConfig.host,
        port: connectionConfig.port
      });

      _.each(connectionConfig.databases, function(databaseConfig) {
        newConn.addDatabase({
          name: databaseConfig.name,
          host: connectionConfig.host,
          port: connectionConfig.port,
          auth: databaseConfig.auth
        });
      });

      connections.push(newConn);
    });

    return resolve(connections);
  });
}

function removeConnection(connectionId, connections) {
  return new Promise(function(resolve, reject) {
    var foundConnection = _.findWhere(connections, {
      id: connectionId
    });

    if (foundConnection) {
      var index = connections.indexOf(foundConnection);
      connections.splice(index, 1);
    } else {
      return reject(new Error('Connection not found'));
    }

    return resolve(connections);
  });
}

/**
 * @exports
 */
module.exports = new ConnectionRepository();
