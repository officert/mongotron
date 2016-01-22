'use strict';

const _ = require('underscore');
const Promise = require('bluebird');
const uuid = require('node-uuid');

const fileUtils = require('lib/utils/fileUtils');
const appConfig = require('src/config/appConfig');
const errors = require('lib/errors');
const Connection = require('lib/entities/connection');

const DB_CONNECTIONS = appConfig.dbConfigPath;

/** @module Connection */
/** @class */
class ConnectionRepository {
  constructor() {}

  /**
   * Find a connection by id
   * @param {string} id - Id of the connection to find
   */
  findById(id) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));

      return _this.list()
        .then((connections) => {
          return findConnectionById(id, connections);
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Create a new connection
   * @param {object} options
   * @param {string} options.name - Connection name
   * @param {string} options.host - Connection host
   * @param {string} options.port - Connection port
   * @param {string} [options.databaseName] - Database name
   * @param {object} [options.replicaSet] - Replica set config
   * @param {string} options.replicaSet.name - Replica set name
   * @param {array<object>} options.replicaSet.sets - Replica set servers
   * @param {object} [options.auth]
   */
  create(options) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (!options) return reject(new errors.InternalServiceError('options is required'));

      let connections;
      let newConnection;

      options.id = uuid.v4(); //assign a "unique" id

      return _this.list()
        .then((_connections) => {
          connections = _connections;
          return createConnection(options, _connections);
        })
        .then((_connection) => {
          newConnection = _connection;
          connections.push(newConnection);
          return convertConnectionInstancesIntoConfig(connections);
        })
        .then(writeConfigFile)
        .then(() => {
          return new Promise((resolve1) => {
            return resolve1(newConnection);
          });
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * List all connections
   */
  list() {
    return getConnectionInstances();
  }

  /**
   * Update a connection by id
   * @param {string} id - id of the connection to update
   * @param {object} updates - hash of updates to apply to the connection
   * @param {string} [updates.name] - connection name
   * @param {string} [updates.host] - Connection host
   * @param {string} [updates.port ]- Connection port
   * @param {string} [updates.databaseName] - Database name
   * @param {object} [updates.replicaSet] - Replica set config
   * @param {string} [updates.replicaSet.name] - Replica set name
   * @param {array<object>} [updates.replicaSet.sets] - Replica set servers
   * @param {object} [updates.auth]
   */
  update(id, updatedConnection) {
    let _this = this;
    let connections;

    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));
      if (!updatedConnection) return reject(new errors.InvalidArugmentError('updatedConnection is required'));

      return _this.list()
        .then((_connections) => {
          connections = _connections;
          return findConnectionById(id, connections);
        })
        .then((connection) => {
          return updateConnection(connection, updatedConnection, connections);
        })
        .then(convertConnectionInstancesIntoConfig)
        .then(writeConfigFile)
        .then(() => {
          return resolve(updatedConnection);
        })
        .catch(reject);
    });
  }

  /**
   * Delete a connection by id
   * @param {string} id - id of the connection to delete
   */
  delete(id) {
    var _this = this;

    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));

      return _this.list()
        .then((connections) => {
          return findConnectionById(id, connections)
            .then(function(connection) {
              return removeConnection(connection, connections);
            });
        })
        .then(convertConnectionInstancesIntoConfig)
        .then(writeConfigFile)
        .then(() => {
          return resolve(null);
        })
        .catch(reject);
    });
  }

  /**
   * Check if a connection exists by name
   * @param {String} name
   */
  existsByName(name) {
    var _this = this;
    return _this.list()
      .then((connections) => {
        return new Promise((resolve) => {
          var existingConnection = _.findWhere(connections, {
            name: name
          });

          return resolve(existingConnection ? true : false);
        });
      });
  }
}

function readConfigFile() {
  return fileUtils.readJsonFile(DB_CONNECTIONS);
}

function writeConfigFile(data) {
  return fileUtils.writeJsonFile(DB_CONNECTIONS, data);
}

function getConnectionInstances() {
  return readConfigFile()
    .then((connectionConfigs) => {
      return new Promise((resolve) => {
        return resolve(connectionConfigs && connectionConfigs.length ? connectionConfigs.map(generateConnectionInstanceFromConfig) : []);
      });
    });
}

function generateConnectionInstanceFromConfig(connectionConfig) {
  var newConn = new Connection({
    id: connectionConfig.id || uuid.v4(),
    name: connectionConfig.name,
    host: connectionConfig.host,
    port: connectionConfig.port,
    replicaSet: connectionConfig.replicaSet
  });

  _.each(connectionConfig.databases, (databaseConfig) => {
    newConn.addDatabase({
      id: databaseConfig.id || uuid.v4(),
      name: databaseConfig.name,
      host: connectionConfig.host,
      port: connectionConfig.port,
      auth: databaseConfig.auth
    });
  });

  return newConn;
}

function convertConnectionInstancesIntoConfig(connections) {
  return new Promise((resolve) => {
    let configs = connections.map(convertConnectionInstanceIntoConfig);
    return resolve(configs);
  });
}

function convertConnectionInstanceIntoConfig(connection) {
  //unique id's are added to the entities to emulate
  //storing them in a real database that would assign unique ids
  //the app relies on the various entities to have unique ids so
  //until I change to storing these in something that assigns ids
  //we have to manually add them

  let config = {
    id: connection.id || uuid.v4(),
    name: connection.name,
    host: connection.host,
    port: connection.port,
    replicaSet: connection.replicaSet,
    databases: connection.databases ? connection.databases.map((database) => {
      var db = {
        id: database.id || uuid.v4(),
        name: database.name
      };

      if (database.auth) {
        db.auth = {
          username: database.auth.username,
          password: database.auth.password
        };
      }

      return db;
    }) : []
  };

  return config;
}

function findConnectionById(connectionId, connections) {
  return new Promise((resolve, reject) => {
    var foundConnection = _.findWhere(connections, {
      id: connectionId
    });

    if (foundConnection) {
      return resolve(foundConnection);
    } else {
      return reject(new errors.ObjectNotFoundError('Connection not found'));
    }
  });
}

function createConnection(options) {
  return new Promise((resolve) => {
    var newConn = new Connection(options);

    return resolve(newConn);
  });
}

function removeConnection(connection, connections) {
  return new Promise((resolve) => {
    var index = connections.indexOf(connection);
    connections.splice(index, 1);

    return resolve(connections);
  });
}

function updateConnection(originalConnection, updatedConnection, connections) {
  return new Promise((resolve) => {
    // connection = _.extend(connection, options);
    let index = connections.indexOf(originalConnection);

    connections.splice(index, 1, updatedConnection);

    return resolve(connections);
  });
}

module.exports = new ConnectionRepository();
