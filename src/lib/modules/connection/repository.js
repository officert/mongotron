'use strict';

const _ = require('underscore');
const Promise = require('bluebird');
const uuid = require('node-uuid');

const fileUtils = require('lib/utils/fileUtils');
const appConfig = require('src/config/appConfig');
const errors = require('lib/errors');
const Connection = require('lib/entities/connection');

const DB_CONNECTIONS = appConfig.dbConfigPath;

/**
 * @class ConnectionRepository
 */
class ConnectionRepository {
  /**
   * @constructor ConnectionRepository
   */
  constructor() {}

  /**
   * @method findById
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
   * @method create
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
   * @method list
   */
  list() {
    return getConnectionInstances();
  }

  /**
   * @method update
   * @param {String} id - id of the connection to update
   */
  update(id, options) {
    var _this = this;

    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));
      if (!options) return reject(new errors.InvalidArugmentError('options is required'));

      var connection;

      return _this.list()
        .then((connections) => {
          return findConnectionById(id, connections)
            .then(function(_connection) {
              connection = _connection;

              return updateConnection(_connection, options, connections);
            });
        })
        .then(convertConnectionInstancesIntoConfig)
        .then(writeConfigFile)
        .then(() => {
          return resolve(connection);
        })
        .catch(reject);
    });
  }

  /**
   * @method delete
   * @param {String} id - id of the connection to delete
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
   * @method existsByName
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
  return new Promise((resolve, reject) => {
    fileUtils.readJsonFile(DB_CONNECTIONS, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

function writeConfigFile(data) {
  return new Promise((resolve, reject) => {
    fileUtils.writeJsonFile(DB_CONNECTIONS, data, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

function getConnectionInstances() {
  return readConfigFile()
    .then((connectionConfigs) => {
      return new Promise((resolve) => {
        return resolve(connectionConfigs.map(generateConnectionInstanceFromConfig));
      });
    });
}

function generateConnectionInstanceFromConfig(connectionConfig) {
  var newConn = new Connection({
    id: connectionConfig.id || uuid.v4(),
    name: connectionConfig.name,
    host: connectionConfig.host,
    port: connectionConfig.port
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
    return resolve(connections.map(convertConnectionInstanceIntoConfig));
  });
}

function convertConnectionInstanceIntoConfig(connection) {
  //unique id's are added to the entities to emulate
  //storing them in a real database that would assign unique ids
  //the app relies on the various entities to have unique ids so
  //until I change to storing these in something that assigns ids
  //we have to manually add them

  return {
    id: connection.id || uuid.v4(),
    name: connection.name,
    host: connection.host,
    port: connection.port,
    databases: connection.databases ? connection.databases.map((database) => {
      var db = {
        name: database.name
      };

      if (database.auth) {
        db.auth = {
          id: database.id || uuid.v4(),
          username: database.auth.username,
          password: database.auth.password
        };
      }

      return db;
    }) : []
  };
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
    newConn.addDatabase({
      id: uuid.v4(),
      name: options.databaseName,
      host: options.host,
      port: options.port,
      auth: options.auth
    });
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

function updateConnection(connection, options, connections) {
  return new Promise((resolve) => {
    connection = _.extend(connection, options);

    return resolve(connections);
  });
}

/**
 * @exports
 */
module.exports = new ConnectionRepository();
