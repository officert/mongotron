'use strict';

const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;

const Collection = require('./collection');
const errors = require('./errors');

/**
 * @class Database
 */
class Database {
  /**
   * @constructor Database
   *
   * @param {Object} options
   * @param {String} options.name - name of the database
   * @param {String} options.host - host of the database, defaults to localhost
   * @param {String} options.port - port of the database, defaults to 27017
   * @param {Object} options.auth - database auth info
   * @param {String} options.auth.username - database auth username
   * @param {String} options.auth.password - database auth password
   */
  constructor(options) {
    options = options || {};

    var _this = this;
    _this.name = options.name || 'test';
    _this.host = options.host || 'localhost';
    _this.port = options.port || 27017;
    _this.auth = options.auth || null;

    _this.isOpen = false;

    _this.collections = [];

    _this._dbConnection = new MongoDb(_this.name, new MongoServer(_this.host, _this.port));
  }

  /**
   * @method open
   * @param {Function} next - callback function
   */
  open(next) {
    var _this = this;

    _this._dbConnection.open(function(err) {
      if (err) return next(new errors.DatabaseError(err));

      if (_this.auth) {
        _this._dbConnection.authenticate(_this.auth.username, _this.auth.password, function(err) {
          if (err) return next(new errors.DatabaseError(err));

          return next(null);
        });
      } else {
        return next(null);
      }
    });
  }

  /**
   * @method listCollections
   * @param {Function} next - callback function
   */
  listCollections(next) {
    var _this = this;

    if (!_this.open) return next(new Error('Database is not open'));

    if (_this.collections && _this.collections.length) {
      return next(null, _this.collections);
    }

    _this._dbConnection.collections(function(err, collections) {
      if (err) return next(new errors.DatabaseError(err));

      _.each(collections, function(collection) {
        _this._addCollection(collection);
      });

      return next(null, _this.collections);
    });
  }

  /**
   * @method _addCollection
   * @param {Object} config - callback function
   * @param {String} config.collectionName - name of the collection
   */
  _addCollection(config) {
    config = config || {};

    var _this = this;

    var existingCollection = _.findWhere(_this.collections, {
      name: config.collectionName
    });

    if (existingCollection) return;

    config.name = config.collectionName;
    config.serverName = _this.host + ':' + _this.port;
    config.databaseName = _this.name;

    var collection = new Collection(_this._dbConnection, config);

    _this.collections.push(collection);

    return collection;
  }
}

/**
 * @exports
 */
module.exports = Database;
