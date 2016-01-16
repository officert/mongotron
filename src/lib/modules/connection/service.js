'use strict';

const Promise = require('bluebird');

const logger = require('lib/modules/logger');
const errors = require('lib/errors');
const connectionValidator = require('./validator');
const connectionRepository = require('./repository');

const DEFAULT_CONNECTIONS = require('./defaults');

/** @module Connection */
/** @class */
class ConnectionService {
  constructor() {}

  get defaultConnections() {
    return JSON.stringify(DEFAULT_CONNECTIONS);
  }

  /**
   * Find a connection by id
   * @param {string} id - Id of the connection to find
   */
  findById(id) {
    return connectionRepository.findById(id);
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
    //map it to a new object so nothing unexpected can be passed in and saved
    let newConnection = {
      name: options.name,
      host: options.host,
      port: options.port,
      databaseName: options.databaseName,
      replicaSet: options.replicaSet,
      auth: options.auth
    };

    return new Promise((resolve, reject) => {
      connectionValidator.validateCreate(newConnection)
        .then(() => {
          //TODO: move into validator so update runs it too
          return connectionRepository.existsByName(newConnection.name);
        })
        .then((exists) => {
          return new Promise((resolve, reject) => {
            if (exists) return reject(new errors.InvalidArugmentError('Sorry, connection names must be unique'));
            return resolve(null);
          });
        })
        .then(() => {
          return connectionRepository.create(newConnection);
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * List all connections
   */
  list() {
    return connectionRepository.list();
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
  update(id, updates) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));
      if (!updates) return reject(new errors.InvalidArugmentError('updates is required'));

      _this.findById(id)
        .then((connection) => {
          return _applyConnectionUpdatesPreValidation(connection, updates);
        })
        .then(connectionValidator.validateUpdate)
        .then((connection) => {
          return _applyConnectionUpdatesPostValidation(connection, updates);
        })
        .then((connection) => {
          connectionRepository.update(id, connection)
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  }

  /**
   * Delete a connection by id
   * @param {string} id - id of the connection to delete
   */
  delete(id) {
    return connectionRepository.delete(id);
  }
}

/**
 * Validate updates to a connection
 * @param {Connection} connection - connection instance
 * @param {object} updates - hash of updates to apply to validate
 * @private
 */
function _applyConnectionUpdatesPreValidation(connection, updates) {
  return new Promise((resolve) => {
    if ('name' in updates) connection.name = updates.name;
    if ('host' in updates) {
      connection.host = updates.host;
      delete connection.replicaSet;
      if (updates.host === 'localhost') {
        delete connection.databases;
      }
    }
    if ('port' in updates) connection.port = updates.port;
    if ('databaseName' in updates) connection.databaseName = updates.databaseName;
    if ('auth' in updates) {
      if (!updates.auth) delete connection.auth; //null or undefined so remove it
      else if (connection.auth) {
        if ('username' in updates.auth) connection.auth.username = updates.auth.username;
        if ('password' in updates.auth) connection.auth.password = updates.auth.password;
      } else {
        connection.auth = updates.auth;
      }
    }
    if ('replicaSet' in updates) {
      if (!updates.replicaSet) delete connection.replicaSet; //null or undefined so remove it
      else if (connection.replicaSet) {
        delete connection.host;
        delete connection.port;
        if ('name' in updates.replicaSet) connection.replicaSet.name = updates.replicaSet.name;
        if ('sets' in updates.replicaSet) connection.replicaSet.sets = updates.replicaSet.sets;
      } else {
        connection.replicaSet = updates.replicaSet;
      }
    }

    if (connection.host !== 'localhost') {
      let db = connection.databases && connection.databases.length ? connection.databases[0] : null;

      if (!db) logger.warn('connection service - _applyConnectionUpdates() - connection has no database');
      else {
        if (!connection.databaseName) connection.databaseName = db.name;
        let auth = db.auth;
        if (connection.auth) {
          connection.auth.username = connection.auth.username || (auth ? auth.username : null);
          connection.auth.password = connection.auth.password || (auth ? auth.password : null);
        }
      }
    }

    return resolve(connection);
  });
}

/**
 * Validate updates to a connection
 * @param {Connection} connection - connection instance
 * @param {object} updates - hash of updates to apply to validate
 * @private
 */
function _applyConnectionUpdatesPostValidation(connection, updates) {
  return new Promise((resolve) => {

    let db = connection.databases && connection.databases.length ? connection.databases[0] : null;

    if (db) {
      if ('auth' in updates) {
        if (!updates.auth) {
          delete db.auth;
        } else {
          db.auth = db.auth || {};
          db.auth.username = (updates.auth ? updates.auth.username : null) || db.auth.username;
          db.auth.password = (updates.auth ? updates.auth.password : null) || db.auth.password;
        }
      }
      if ('databaseName' in updates) {
        db.name = updates.databaseName;
      }
      if ('host' in updates) db.host = updates.host;
      if ('port' in updates) db.port = updates.port;
    } else {
      if ('host' in updates && updates.host !== 'localhost') {
        connection.addDatabase({
          host: updates.host,
          port: updates.port
        });
      }
    }

    return resolve(connection);
  });
}

module.exports = new ConnectionService();
