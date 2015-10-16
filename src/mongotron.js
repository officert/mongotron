'use strict';

const Promise = require('bluebird');

const connectionService = require('lib/connectionService');

/**
 * @constructor Mongotron
 */
class Mongotron {
  /**
   * @method init - Mongotron application entry point
   * @param {Function} next - callback function
   */
  init() {
    return Promise.all([
      connectionService.initializeConnections()
    ]);
  }
}

/**
 * @exports
 */
module.exports = new Mongotron();
