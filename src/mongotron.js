'use strict';

const ConnectionService = require('lib/connectionService');

/**
 * @constructor Mongotron
 */
class Mongotron {
  /**
   * @method init - Mongotron application entry point
   * @param {Function} next - callback function
   */
  init(next) {
    ConnectionService.initializeConnections(next);
  }
}

/**
 * @exports
 */
module.exports = new Mongotron();
