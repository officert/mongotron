'use strict';

class TestUtils {
  compareObjects(obj1, obj2) {
    if (!obj1 || !obj2) return false;
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}

module.exports = new TestUtils();
