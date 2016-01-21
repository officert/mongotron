'use strict';

const ObjectId = require('mongodb').ObjectId;

/** @class */
class MongoUtils {
  isObjectId(id) {
    return id instanceof ObjectId;
  }

  isLocalHost(host) {
    return host === 'localhost' || host === '127.0.0.1';
  }
}

module.exports = new MongoUtils();
