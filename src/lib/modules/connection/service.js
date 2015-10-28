'use strict';

const Promise = require('bluebird');

const errors = require('lib/errors');
const connectionRepository = require('./repository');

/**
 * @class ConnectionService
 */
class ConnectionService {
  /**
   * @constructor ConnectionService
   */
  constructor() {}

  /**
   * @method create
   */
  create(options) {
    return new Promise((resolve, reject) => {
      if (!options) return reject(new errors.InvalidArugmentError('options is required'));
      if (!options.name) return reject(new errors.InvalidArugmentError('options.name is required'));
      if (!options.host) return reject(new errors.InvalidArugmentError('options.host is required'));
      if (!options.port) return reject(new errors.InvalidArugmentError('options.port is required'));

      if (options.port < 0 || options.port > 65535) return reject(new errors.InvalidArugmentError('port number must be between 0 and 65535'));

      return connectionRepository.existsByName(options.name)
        .then(function(exists) {
          return new Promise((resolve, reject) => {
            if (exists) return reject(new errors.InvalidArugmentError('Sorry, connection names must be unique.'));
            return resolve(null);
          });
        })
        .then(() => {
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
