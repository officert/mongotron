'use strict';

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
    return connectionRepository.create(options);
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
