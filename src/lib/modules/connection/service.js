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
    let connection;

    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));
      if (!updates) return reject(new errors.InvalidArugmentError('updates is required'));

      _this.findById(id)
        .then((_connection) => {
          connection = _connection;
          return connectionValidator.validateUpdate(updates, connection);
        })
        .then(() => {
          if ('name' in updates) connection.name = updates.name;

          if (connection.host !== 'localhost') {
            let db = connection.databases ? connection.databases[0] : null;
            if (!db) logger.warn('connection service - update() - remove connection has no db');
            else {
              if ('auth' in updates) db.auth = updates.auth;
            }
          }

          if ('replicaSet' in updates) connection.replicaSet = updates.replicaSet;

          // if (newConnection.databaseName || (newConnection.auth && (newConnection.auth.username || newConnection.auth.password))) {
          //   if (connection.databases && connection.databases.length) {
          //     let db = connection.databases[0];
          //     if (newConnection.auth && newConnection) {
          //       db.auth = newConnection.auth;
          //     }
          //     db.name = newConnection.databaseName || db.name;
          //
          //     newConnection.databases = [connection.databases[0]];
          //   } else {
          //     // connection.addDatabase({
          //     //
          //     // });
          //   }
          // }

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

/**
 * @exports
 */
module.exports = new ConnectionService();
