'use strict';

const Promise = require('bluebird');

const logger = require('lib/modules/logger');
const errors = require('lib/errors');
const connectionValidator = require('./validator');
const connectionRepository = require('./repository');

const DEFAULT_CONNECTIONS = require('./defaults');

/**
 * @class ConnectionService
 */
class ConnectionService {
  get defaultConnections() {
    return JSON.stringify(DEFAULT_CONNECTIONS);
  }

  /**
   * @constructor ConnectionService
   */
  constructor() {}

  /**
   * @method findById
   */
  findById(id) {
    return connectionRepository.findById(id);
  }

  /**
   * @method create
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
   * @method list
   */
  list() {
    return connectionRepository.list();
  }

  /**
   * @method update
   * @param {String} id - id of the connection to update
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
   * @method delete
   * @param {String} id - id of the connection to delete
   */
  delete(id) {
    return connectionRepository.delete(id);
  }
}

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
        connection.auth = connection.auth || auth;
        if (connection.auth) {
          connection.auth.username = connection.auth.username || (auth ? auth.username : null);
          connection.auth.password = connection.auth.password || (auth ? auth.password : null);
        }
      }
    }

    // console.log('pre updates', updates);
    // console.log('pre updated connection', connection);

    return resolve(connection);
  });
}

function _applyConnectionUpdatesPostValidation(connection, updates) {
  return new Promise((resolve) => {

    let db = connection.databases && connection.databases.length ? connection.databases[0] : null;

    if (db) {
      if ('auth' in updates) {
        db.auth = db.auth || {};
        db.auth.username = (updates.auth ? updates.auth.username : null) || db.auth.username;
        db.auth.password = (updates.auth ? updates.auth.password : null) || db.auth.password;
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

    // console.log('post updates', updates);
    // console.log('post updated connection', connection);

    return resolve(connection);
  });
}

/**
 * @exports
 */
module.exports = new ConnectionService();
