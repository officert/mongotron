'use strict';

var mongodb = require('mongodb');

class TestUtils {
  compareObjects(obj1, obj2) {
    if (!obj1 || !obj2) return false;
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Tests that the resulting objectId is an instance of mongodb.ObjectId
   * and tests that it matches the toString value of the expected ObjectId
   * @param  {ObjectId} expected The ObjectId that's expected
   * @param  {ObjectId} result   The ObjectId that's returned
   * @return {[type]}          [description]
   */
  compareMongoObjectIds(expected, result) {
    var expectedString = expected.toString();
    var resultString = result.toString();

    if (result instanceof mongodb.ObjectId !== true) return false;
    if (expectedString !== resultString) return false;
    return true;
  }
}

module.exports = new TestUtils();
