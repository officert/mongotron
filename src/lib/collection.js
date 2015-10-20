'use strict';

const MongoDb = require('mongodb').Db;

const errors = require('./errors');

const Entity = require('./entity');

/**
 * @class Connection
 */
class Collection extends Entity {
  /**
   * @constructor Collection
   *
   * @param {Object} database - MongoDb object
   * @param {Object} options
   * @param {String} options.name - name of the collection
   * @param {String} options.serverName - name of the server
   * @param {String} options.databaseName - name of the database
   */
  constructor(database, options) {
    super();

    if (!(database instanceof MongoDb)) console.error('Collection ctor - database is not an instance of MongoDb');

    options = options || {};

    var _this = this;
    _this.name = options.name || 'test';
    _this.serverName = options.serverName;
    _this.databaseName = options.databaseName;
    _this._dbCollection = database.collection(_this.name);
  }

  /**
   * @method find
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   * @param {Function} next - callback function
   */
  find(query, options, next) {
    if (arguments.length === 2) {
      next = options;
      options = {};
    }
    if (!query) return next(new errors.InvalidArugmentError('query is required'));

    var _this = this;

    options.limit = 50;

    //TODO: validate the query??

    _this._dbCollection.find(query, options).toArray(next);
  }

  /**
   * @method aggregate
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   * @param {Function} next - callback function
   */
  aggregate(query, options, next) {
    if (arguments.length === 2) {
      next = options;
      options = {};
    }
    if (!query) return next(new errors.InvalidArugmentError('query is required'));

    var _this = this;

    options.limit = 50;

    //TODO: validate the query??

    _this._dbCollection.aggregate(query, options).toArray(next);
  }
}

/**
 * @exports
 */
module.exports = Collection;
