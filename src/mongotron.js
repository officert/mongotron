'use strict';

const ConnectionService = require('lib/connectionService');

/**
 * @constructor Mongotron
 */
class Mongotron {
  init(next) {
    ConnectionService.initializeConnections(next);
  }
}

/**
 * @exports
 */
module.exports = new Mongotron();
