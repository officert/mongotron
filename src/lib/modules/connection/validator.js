'use strict';

const Promise = require('bluebird');

const errors = require('lib/errors');
const mongoUtils = require('src/lib/utils/mongoUtils');

/** @module Connection */
/** @class */
class ConnectionValidator {
  /**
   * Validate a connection for creating
   * @param {object} data
   */
  validateCreate(data) {
    return new Promise((resolve, reject) => {
      _baseValidate(data)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Validate a connection for updating
   * @param {object} data
   */
  validateUpdate(data) {
    return new Promise((resolve, reject) => {
      _baseValidate(data)
        .then(resolve)
        .catch(reject);
    });
  }
}

function _baseValidate(data) {
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
    } else {
      if (!data.host) return reject(new errors.InvalidArugmentError('data.host is required'));
      if (!data.port) return reject(new errors.InvalidArugmentError('data.port is required'));
      if (data.port && (data.port < 0 || data.port > 65535)) return reject(new errors.InvalidArugmentError('Port number must be between 0 and 65535.'));
    }

    if (data.auth) {
      if (!data.auth.username) return reject(new errors.InvalidArugmentError('auth.username is required'));
      if (!data.auth.password) return reject(new errors.InvalidArugmentError('auth.password is required'));
    }

    if (!mongoUtils.isLocalHost(data.host)) {
      if (!data.databaseName) return reject(new errors.InvalidArugmentError('database is required when connecting to a remote server.'));
    }

    return resolve(data);
  });
}

module.exports = new ConnectionValidator();
