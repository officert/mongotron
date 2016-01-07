'use strict';

const Promise = require('bluebird');

const errors = require('lib/errors');

class ConnectionValidator {
  validateCreate(newConnection) {
    return new Promise((resolve, reject) => {
      if (!newConnection.name) return reject(new errors.InvalidArugmentError('connection.name is required'));

      if (!newConnection.replicaSet) {
        if (!newConnection.host) return reject(new errors.InvalidArugmentError('newConnection.host is required'));
        if (!newConnection.port) return reject(new errors.InvalidArugmentError('newConnection.port is required'));
        if (newConnection.port < 0 || newConnection.port > 65535) return reject(new errors.InvalidArugmentError('Port number must be between 0 and 65535.'));
      }

      if (newConnection.replicaSet) {
        if (!newConnection.replicaSet.name) return reject(new errors.InvalidArugmentError('newConnection.replicaSet.name is required'));
        if (!newConnection.replicaSet.sets || !newConnection.replicaSet.sets.length) return reject(new errors.InvalidArugmentError('newConnection.replicaSet.sets is required'));
        for (let i = 0; i < newConnection.replicaSet.sets.length; i++) {
          let set = newConnection.replicaSet.sets[i];

          if (!set.host) return reject(new errors.InvalidArugmentError('newConnection.replicaSet.sets[' + i + '].host is required'));
          if (!set.port) return reject(new errors.InvalidArugmentError('newConnection.replicaSet.sets[' + i + '].port is required'));
          if (set.port < 0 || set.port > 65535) return reject(new errors.InvalidArugmentError('newConnection.replicaSet.sets[' + i + '].port number must be between 0 and 65535.'));
        }
      }

      if (newConnection.host !== 'localhost' && !newConnection.databaseName) return reject(new errors.InvalidArugmentError('database is required when connecting to a remote server.'));

      _baseValidate({
          connection: newConnection
        })
        .then(resolve)
        .catch(reject);
    });
  }

  validateUpdate(connection) {
    return new Promise((resolve, reject) => {

      _baseValidate({
          connection
        })
        .then(resolve)
        .catch(reject);
    });
  }
}

function _baseValidate(options) {
  let connection = options.connection;

  return new Promise((resolve) => {
    if (connection.replicaSet) {
      connection.replicaSet = {
        name: connection.replicaSet.name,
        sets: connection.replicaSet.sets.map((set) => {
          return {
            host: set.host,
            port: set.port
          };
        })
      };
    }
    return resolve(connection);
  });
}

/**
 * @exports ConnectionValidator
 *
 */
module.exports = new ConnectionValidator();
