'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const _ = require('underscore');
const Promise = require('bluebird');

const Connection = require('lib/entities/connection');

const DB_CONNECTIONS = path.join(__dirname, '../../../' ,'config/dbConnections.json');

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
      console.log(data);
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

function generateConnectionInstancesFromConfig(configData) {
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

      var connection = createConnection(databaseConfigs);

      connections.push(connection);
    }

    return resolve(connections);
  });
}

function createConnection(databaseConfigs) {
  var firstConfig = databaseConfigs[0];

  var connection = new Connection({
    name: firstConfig.name,
    host: firstConfig.host,
    port: firstConfig.port,
    databaseConfigs: databaseConfigs
  });

  return connection;
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
