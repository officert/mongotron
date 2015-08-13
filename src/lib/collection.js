/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
// const MongoDb = require('mongodb').Db;
// const MongoServer = require('mongodb').Server;
// const util = require('util');
//
// const errors = require('./errors');

/* ------------------------------------------------
 * Constructor
 * ------------------------------------------------ */
/* @constructor Database
 */
function Collection(options) {
  options = options || {};

  var _this = this;
  _this.name = options.collectionName || 'test';
}

/*
 * @exports
 *
 */
module.exports = Collection;
