'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const errors = require('lib/errors');
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
    return new Promise((resolve, reject) => {
      if (!options) return reject(new errors.InvalidArugmentError('options is required'));
      if (!options.name) return reject(new errors.InvalidArugmentError('options.name is required'));

      if (!options.replicaSet) {
        if (!options.host) return reject(new errors.InvalidArugmentError('options.host is required'));
        if (!options.port) return reject(new errors.InvalidArugmentError('options.port is required'));
        if (options.port < 0 || options.port > 65535) return reject(new errors.InvalidArugmentError('Port number must be between 0 and 65535.'));
      }

      if (options.replicaSet) {
        if (!options.replicaSet.name) return reject(new errors.InvalidArugmentError('options.replicaSet.name is required'));
        if (!options.replicaSet.sets || !options.replicaSet.sets.length) return reject(new errors.InvalidArugmentError('options.replicaSet.sets is required'));
        for (let i = 0; i < options.replicaSet.sets.length; i++) {
          let set = options.replicaSet.sets[i];

          if (!set.host) return reject(new errors.InvalidArugmentError('options.replicaSet.sets[' + i + '].host is required'));
          if (!set.port) return reject(new errors.InvalidArugmentError('options.replicaSet.sets[' + i + '].port is required'));
          if (set.port < 0 || set.port > 65535) return reject(new errors.InvalidArugmentError('options.replicaSet.sets[' + i + '].port number must be between 0 and 65535.'));
        }
      }

      if (options.host !== 'localhost' && !options.databaseName) return reject(new errors.InvalidArugmentError('database is required when connecting to a remote server.'));

      return connectionRepository.existsByName(options.name)
        .then(function(exists) {
          return new Promise((resolve, reject) => {
            if (exists) return reject(new errors.InvalidArugmentError('Sorry, connection names must be unique.'));
            return resolve(null);
          });
        })
        .then(() => {
          if (options.replicaSet) {
            options.replicaSet = {
              name: options.replicaSet.name,
              sets: options.replicaSet.sets.map((set) => {
                return {
                  host: set.host,
                  port: set.port
                };
              })
            };
          }
          return connectionRepository.create(options);
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
