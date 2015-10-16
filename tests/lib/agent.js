'use strict';

const request = require('supertest');

/**
 * @constructor Agent
 */
class Agent {
  /**
   * @method app
   */
  init(app) {
    var _this = this;

    _this.app = app;
    _this.agent = request.agent(app);
  }

  /**
   * @method getAgent
   */
  getAgent() {
    return this.agent;
  }
}

/**
 * @exports
 */
module.exports = new Agent();
