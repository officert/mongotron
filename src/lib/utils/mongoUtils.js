'use strict';

const ObjectId = require('mongodb').ObjectId;

/**
 * @class MongoUtils
 */
class MongoUtils {
  isObjectId(id) {
    return id instanceof ObjectId;
  }
}

/**
 * @exports MongoUtils
 */
module.exports = new MongoUtils();
