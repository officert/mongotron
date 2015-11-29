'use strict';

const MongoDb = require('mongodb').Db;
const Promise = require('bluebird');

const mongoUtils = require('src/lib/utils/mongoUtils');
const errors = require('lib/errors');

const PAGE_SIZE = 50;

/**
 * @class Collection
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
    _this.name = options.name;
    _this.connection = options.connection;
    _this.database = options.database;
    _this.serverName = options.serverName;
    _this.databaseName = options.databaseName;
    _this._dbCollection = database.collection(_this.name);
  }

  /**
   * @method insertOne
   * @param {Object} doc
   */
  insertOne(doc) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this._dbCollection.insertOne(doc, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method find
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
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
   */
  deleteMany(query, options) {
    var _this = this;
    options = options || {};

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));

      _this._dbCollection.deleteMany(query, options, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method deleteById
   * @param {Object} Mongo ObjectId
   */
  deleteById(objectId) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if (!objectId) return reject(new errors.InvalidArugmentError('id is required'));
      if (!mongoUtils.isObjectId(objectId)) return reject(new errors.InvalidArugmentError('objectId must be an instance of ObjectId'));

      _this._dbCollection.deleteOne({
        _id: objectId
      }, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method deleteOne
   * @param {Object} query - mongo query
   */
  deleteOne(query) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));

      _this._dbCollection.deleteOne(query, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method aggregate
   * @param {Object} query - mongo query
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

  /**
   * @method updateMany
   * @param {Object} query - mongo query
   * @param {Object} updates - updates to apply
   * @param {Object} [options] - mongo query options
   */
  updateMany(query, updates, options) {
    var _this = this;
    options = options || {};

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));
      if (!updates) return reject(new errors.InvalidArugmentError('updates is required'));

      _this._dbCollection.updateMany(query, updates, options, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method updateById
   * @param {Object} Mongo ObjectId
   * @param {Object} updates - updates to apply
   */
  updateById(objectId, updates) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if (!objectId) return reject(new errors.InvalidArugmentError('id is required'));
      if (!updates) return reject(new errors.InvalidArugmentError('updates is required'));
      if (!mongoUtils.isObjectId(objectId)) return reject(new errors.InvalidArugmentError('objectId must be an instance of ObjectId'));

      _this._dbCollection.updateOne({
        _id: objectId
      }, updates, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method updateOne
   * @param {Object} query - mongo query
   * @param {Object} updates - updates to apply
   */
  updateOne(query, updates) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));
      if (!updates) return reject(new errors.InvalidArugmentError('updates is required'));

      _this._dbCollection.updateOne(query, updates, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
   * @method drop
   */
  drop() {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this._dbCollection.drop(function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }
}

/**
 * @exports
 */
module.exports = Collection;
