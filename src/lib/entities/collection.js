'use strict';

const MongoDb = require('mongodb').Db;
const Promise = require('bluebird');
const _ = require('underscore');

const mongoUtils = require('src/lib/utils/mongoUtils');
const errors = require('lib/errors');
const Query = require('lib/modules/query/query');

const DEFAULT_PAGE_SIZE = 50;

const QUERY_TYPES = require('lib/modules/query/queryTypes');
const VALID_QUERY_TYPES = _.keys(QUERY_TYPES);

/** @class */
class Collection {
  /**
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

  execQuery(query) {
    var _this = this;

    return new Promise((resolve, reject) => {
      if (!query) return reject(new Error('query is required'));
      if (!(query instanceof Query)) return reject(new Error('query must be an instanceof Query'));
      if (!query.query) return reject(new Error('query must have a query'));

      var mongoMethod = query.mongoMethod;

      if (!mongoMethod) return reject(new Error('collection - exec() : query does not have a mongoMethod'));
      if (!_.contains(VALID_QUERY_TYPES, mongoMethod)) return reject(new Error(`collection - exec() : ${mongoMethod} is not a supported mongo method`));

      var method = _this[mongoMethod];

      if (!method) return reject(new Error(`collection - exec() : ${mongoMethod} is not implemented`));

      var startTime = performance.now();

      method.call(_this, query.query, query.queryOptions)
        .then((result) => {
          var endTime = performance.now();

          return resolve({
            result: result,
            time: (endTime - startTime).toFixed(5)
          });
        })
        .catch(reject);
    });
  }

  /**
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
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   */
  find(query, options) {
    var _this = this;
    options = options || {};

    return new Promise(function(resolve, reject) {
      let stream = options.stream;
      delete options.stream;

      let dbQuery = _this._dbCollection.find(query, options);

      if (options.skip) dbQuery.skip(Number(options.skip));

      dbQuery.limit(options.limit ? Number(options.limit) : DEFAULT_PAGE_SIZE);

      if (stream === true) {
        return resolve(dbQuery.stream());
      } else {
        dbQuery.toArray(function(err, docs) {
          if (err) return reject(err);
          return resolve(docs);
        });
      }
    });
  }

  /**
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   */
  count(query, options) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if (options && options.skip) options.skip = Number(options.skip);
      if (options && options.limit) options.limit = Number(options.limit);

      _this._dbCollection.count(query, options, function(error, result) {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }

  /**
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
   * @param {Object} Mongo ObjectId
   */
  deleteById(objectId) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if (!objectId) return reject(new errors.InvalidArugmentError('id is required'));

      _this._dbCollection.deleteOne({
        _id: objectId
      }, function(err) {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }

  /**
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
   * @param {Object} query - mongo query
   */
  aggregate(query, options) {
    var _this = this;
    options = options || {};

    return new Promise(function(resolve, reject) {
      if (!query) return reject(new errors.InvalidArugmentError('query is required'));

      let stream = options.stream;
      delete options.stream;

      let dbQuery = _this._dbCollection.aggregate(query, options);

      if (options.skip) dbQuery.skip(Number(options.skip));

      dbQuery.limit(options.limit ? Number(options.limit) : DEFAULT_PAGE_SIZE);

      if (stream === true) {
        return resolve(dbQuery.stream());
      } else {
        dbQuery.toArray(function(err, docs) {
          if (err) return reject(err);
          return resolve(docs);
        });
      }
    });
  }

  /**
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
   * Drop the collection
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

module.exports = Collection;
