'use strict';

const ObjectId = require('mongodb').ObjectId;

class MongoUtils {
  isObjectId(id) {
    return id instanceof ObjectId;
  }
}

module.exports = new MongoUtils();
