'use strict';

const MongoDb = require('mongodb').Db;
const Promise = require('bluebird');
const _ = require('underscore');

const MongotronCursor = require('lib/utils/mongotronCursor');
const mongoUtils = require('lib/utils/mongoUtils');
const errors = require('lib/errors');

const DEFAULT_PAGE_SIZE = 50;

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

  /**
   * @param {Object} doc
   */
  insertOne(doc) {
    if (!doc) return Promise.reject(new errors.InvalidArugmentError('doc is required'));

    let cursor = this._dbCollection.insertOne(doc);

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} [query] - mongo query
   * @param {Object} [options] - mongo query options
   */
  find(query, options) {
    options = options || {};

    let stream = options.stream;
    delete options.stream;

    let cursor = this._dbCollection.find(query, options);

    if (options.skip) cursor.skip(Number(options.skip));
    cursor.limit(options.limit ? Number(options.limit) : DEFAULT_PAGE_SIZE);

    if (stream === true) {
      cursor.stream();
    }

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   */
  count(query, options) {
    if (!query) return Promise.reject(new errors.InvalidArugmentError('query is required'));
    options = options || {};

    let cursor = this._dbCollection.count(query, options);

    if (options.skip) cursor.skip(Number(options.skip));
    cursor.limit(options.limit ? Number(options.limit) : DEFAULT_PAGE_SIZE);

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} query - mongo query
   * @param {Object} [options] - mongo query options
   */
  deleteMany(query, options) {
    if (!query) return Promise.reject(new errors.InvalidArugmentError('query is required'));
    options = options || {};

    let cursor = this._dbCollection.deleteMany(query, options);

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} Mongo ObjectId
   */
  deleteById(objectId) {
    if (!objectId) return Promise.reject(new errors.InvalidArugmentError('objectId is required'));

    let cursor = this._dbCollection.deleteOne({
      _id: objectId
    });

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} query - mongo query
   */
  deleteOne(query) {
    if (!query) return Promise.reject(new errors.InvalidArugmentError('query is required'));

    let cursor = this._dbCollection.deleteOne(query);

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} [pipeline] - mongo pipeline
   * @param {Object} [options] - mongo pipeline options
   */
  aggregate(pipeline, options) {
    if (!_.isArray(pipeline)) return Promise.reject('pipeline must be an array');
    options = options || {};

    let stream = options.stream;
    delete options.stream;

    //always return as a cursor
    options.cursor = {};

    let cursor = this._dbCollection.aggregate(pipeline, options);

    if (options.skip) cursor.skip(Number(options.skip));
    cursor.limit(options.limit ? Number(options.limit) : DEFAULT_PAGE_SIZE);

    if (stream === true) {
      cursor.stream();
    }

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} query - mongo query
   * @param {Object} updates - updates to apply
   * @param {Object} [options] - mongo query options
   */
  updateMany(query, updates, options) {
    if (!query) return Promise.reject(new errors.InvalidArugmentError('query is required'));
    if (!updates) return Promise.reject(new errors.InvalidArugmentError('updates is required'));
    options = options || {};

    let cursor = this._dbCollection.updateMany(query, updates, options);

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} Mongo ObjectId
   * @param {Object} updates - updates to apply
   * @param {Object} [options] - mongo query options
   */
  updateById(objectId, updates, options) {
    if (!objectId) return Promise.reject(new errors.InvalidArugmentError('objectId is required'));
    if (!updates) return Promise.reject(new errors.InvalidArugmentError('updates is required'));
    if (!mongoUtils.isObjectId(objectId)) return Promise.reject(new errors.InvalidArugmentError('objectId must be an instance of ObjectId'));
    options = options || {};

    let cursor = this._dbCollection.updateOne({
      _id: objectId
    }, updates, options);

    return new MongotronCursor(cursor);
  }

  /**
   * @param {Object} query - mongo query
   * @param {Object} updates - updates to apply
   * @param {Object} [options] - mongo query options
   */
  updateOne(query, updates, options) {
    if (!query) return Promise.reject(new errors.InvalidArugmentError('query is required'));
    if (!updates) return Promise.reject(new errors.InvalidArugmentError('updates is required'));
    options = options || {};

    let cursor = this._dbCollection.updateOne(query, updates, options);

    return new MongotronCursor(cursor);
  }

  /**
   * Drop the collection
   */
  drop() {
    return new Promise((resolve, reject) => {
      this._dbCollection.drop((err) => {
        if (err) return reject(err);
        return resolve(null);
      });
    });
  }
}

module.exports = Collection;
