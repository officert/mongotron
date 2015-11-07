'use strict';

const MongoDb = require('mongodb').Db;
const Promise = require('bluebird');

const errors = require('lib/errors');

const PAGE_SIZE = 50;

/**
 * @class Connection
 */
class Collection {
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
    if (!(database instanceof MongoDb)) console.error('Collection ctor - database is not an instance of MongoDb');

    options = options || {};

    var _this = this;
    _this.id = options.id;
    _this.name = options.name || 'test';
    _this.connection = options.connection;
    _this.database = options.database;
    _this.serverName = options.serverName;
    _this.databaseName = options.databaseName;
    _this._dbCollection = database.collection(_this.name);
  }

  /**
   * @method insertOne
   * @param {Object} doc
   * @param {Function} next - callback function
   */
  insertOne(doc) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this._dbCollection.insertOne(doc, function(err, newDoc) {
        if (err) return reject(err);
        return resolve(newDoc);
      });
    });
  }

  /**
   * @method find
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   * @param {Function} next - callback function
   */
  find(query, options) {
    var _this = this;
    options = options || {};

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));

      //TODO: validate the query??

      var dbQuery = _this._dbCollection.find(query, options);

      if (options.skip) dbQuery.skip(Number(options.skip));

      dbQuery.limit(options.limit && options.limit <= PAGE_SIZE ? options.limit : PAGE_SIZE);

      dbQuery.toArray(function(err, docs) {
        if (err) return reject(err);
        return resolve(docs);
      });
    });
  }

  /**
   * @method deleteMany
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   * @param {Function} next - callback function
   */
  deleteMany(query, options) {
    var _this = this;
    options = options || {};

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));

      options.limit = 50;

      //TODO: validate the query??

      _this._dbCollection.remove(query, options, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method aggregate
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   */
  aggregate(query, options) {
    var _this = this;
    options = options || {};

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));

      options.limit = 50;

      //TODO: validate the query??

      _this._dbCollection.aggregate(query, options).toArray(function(err, result) {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
}

/**
 * @exports
 */
module.exports = Collection;
