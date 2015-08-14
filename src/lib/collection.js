/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const MongoDb = require('mongodb').Db;
const errors = require('./errors');

/* ------------------------------------------------
 * Constructor
 * ------------------------------------------------ */
/* @constructor Database
 */
function Collection(database, options) {
  if (!(database instanceof MongoDb)) console.error('Collection ctor - database is not an instance of MongoDb');

  options = options || {};

  var _this = this;
  _this.name = options.name || 'test';
  _this._dbCollection = database.collection(_this.name);
}

Collection.prototype.find = function find(query, options, next) {
  if (!query) return next(new errors.InvalidArugmentError('query is required'));
  if (arguments.length === 2) {
    next = options;
    options = {};
  }

  var _this = this;

  //TODO: validate the query??

  _this._dbCollection.find(query, options).toArray(next);
};

/*
 * @exports
 *
 */
module.exports = Collection;
