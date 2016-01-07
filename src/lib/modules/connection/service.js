'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const errors = require('lib/errors');
const connectionValidator = require('./validator');
const connectionRepository = require('./repository');

const ALLOWED_UPDATES = [
  'name',
  'host',
  'port',
  'auth',
  'databaseName'
];

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
      replicaSet: options.replicaSet
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
  update(id, options) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (!id) return reject(new errors.InvalidArugmentError('id is required'));
      if (!options) return reject(new errors.InvalidArugmentError('options is required'));

      options = _.pick(options, ALLOWED_UPDATES);

      if (options.auth && options.auth.username && !options.auth.password) return reject(new errors.InvalidArugmentError('password is required for authentication'));
      if (options.auth && options.auth.password && !options.auth.username) return reject(new errors.InvalidArugmentError('username is required for authentication'));

      _this.findById(id)
        .then((connection) => {
          if (!connection) return reject(new errors.ObjectNotFoundError('Connection not found'));

          if (options.databaseName || (options.auth && (options.auth.username || options.auth.password))) {
            if (connection.databases && connection.databases.length) {
              let db = connection.databases[0];
              if (options.auth && options) {
                db.auth = options.auth;
              }
              db.name = options.databaseName || db.name;

              options.databases = [connection.databases[0]];
            } else {
              // connection.addDatabase({
              //
              // });
            }
          }

          connectionRepository.update(id, options)
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
