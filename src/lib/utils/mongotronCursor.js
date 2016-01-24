'use strict';

// const MongoCursor = require('mongodb').Cursor;
const Promise = require('bluebird/js/release/promise')();

class MongotronCursor {
  constructor(cursor) {
    if (!cursor) throw new Error('MongotronCursor - constructor - cursor is required');

    this._cursor = cursor;
  }

  promise() {
    return new Promise((resolve, reject) => {
      this._cursor.toArray((err, documents) => {
        if (err) return reject(err);
        return resolve(documents);
      });
    });
  }

  limit(limit) {
    this._cursor.limit(limit);
    return this;
  }

  skip(skip) {
    this._cursor.skip(skip);
    return this;
  }

  /**
   * Make MongotronCursor Promises/A+ conformant
   */
  then() {
    let promise = this.promise();
    return promise.then.apply(promise, arguments);
  }
}

module.exports = MongotronCursor;
