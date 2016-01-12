'use strict';

const Promise = require('bluebird');

const logger = require('lib/modules/logger');
const errors = require('lib/errors');

class ConnectionValidator {
  validateCreate(data) {
    return new Promise((resolve, reject) => {
      if (!data.name) return reject(new errors.InvalidArugmentError('connection.name is required'));

      if (data.replicaSet) {
        if (!data.replicaSet.name) return reject(new errors.InvalidArugmentError('data.replicaSet.name is required'));
        if (!data.replicaSet.sets || !data.replicaSet.sets.length) return reject(new errors.InvalidArugmentError('data.replicaSet.sets is required'));
        for (let i = 0; i < data.replicaSet.sets.length; i++) {
          let set = data.replicaSet.sets[i];

          if (!set.host) return reject(new errors.InvalidArugmentError('data.replicaSet.sets[' + i + '].host is required'));
          if (!set.port) return reject(new errors.InvalidArugmentError('data.replicaSet.sets[' + i + '].port is required'));
          if (set.port < 0 || set.port > 65535) return reject(new errors.InvalidArugmentError('data.replicaSet.sets[' + i + '].port number must be between 0 and 65535.'));
        }
      }

      if (!data.replicaSet) {
        if (!data.host) return reject(new errors.InvalidArugmentError('data.host is required'));
        if (!data.port) return reject(new errors.InvalidArugmentError('data.port is required'));
      }

      if (data.auth) {
        if (!data.auth.username) return reject(new errors.InvalidArugmentError('auth.username is required'));
        if (!data.auth.password) return reject(new errors.InvalidArugmentError('auth.password is required'));
      }

      _baseValidate({
          data: data
        })
        .then(resolve)
        .catch(reject);
    });
  }

  validateUpdate(data, existingConnection) {
    return new Promise((resolve, reject) => {
      if (existingConnection.host !== 'localhost') {
        let db = existingConnection.databases ? existingConnection.databases[0] : null;

        if (!db) logger.warn('validator - validateUpdate() - connection has no db');
        else {
          if (data.auth && (data.auth.username || data.auth.password)) {
            if (data.auth.password && (!data.auth.username && (!db.auth || !db.auth.username))) return reject(new errors.InvalidArugmentError('auth.username is required'));
            if (data.auth.username && (!data.auth.password && (!db.auth || !db.auth.password))) return reject(new errors.InvalidArugmentError('auth.password is required'));
            data.auth = {
              username: data.auth.username || db.auth.username,
              password: data.auth.password || db.auth.password
            };
          }
        }
      }

      if (data.replicaSet) {

      }

      _baseValidate({
          data: data,
          connection: existingConnection
        })
        .then(resolve)
        .catch(reject);
    });
  }
}

function _baseValidate(options) {
  let data = options.data;
  // let existingConnection = options.connection;

  return new Promise((resolve, reject) => {
    if (data.host === 'localhost') {
      delete data.databaseName;
      delete data.auth;
    }

    if (data.replicaSet) {
      data.replicaSet = {
        name: data.replicaSet.name,
        sets: data.replicaSet.sets.map((set) => {
          return {
            host: set.host,
            port: set.port
          };
        })
      };
    }

    if (!data.replicaSet) {
      if (data.port && (data.port < 0 || data.port > 65535)) return reject(new errors.InvalidArugmentError('Port number must be between 0 and 65535.'));
    }

    if (data.host && data.host !== 'localhost') {
      if (!data.databaseName) return reject(new errors.InvalidArugmentError('database is required when connecting to a remote server.'));
    }

    return resolve(data);
  });
}

/**
 * @exports ConnectionValidator
 *
 */
module.exports = new ConnectionValidator();
