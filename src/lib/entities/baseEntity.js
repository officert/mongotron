'use strict';

const uuid = require('node-uuid');

/**
 * @class BaseEntity
 */
class BaseEntity {
  /**
   * @constructor BaseEntity
   *
   */
  constructor() {
    this.id = uuid.v4();
  }
}

/**
 * @exports
 */
module.exports = BaseEntity;
