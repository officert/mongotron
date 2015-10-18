'use strict';

const uuid = require('node-uuid');

/**
 * @class Entity
 */
class Entity {
  /**
   * @constructor Entity
   *
   */
  constructor() {
    this.id = uuid.v4();
  }
}

/**
 * @exports
 */
module.exports = Entity;
