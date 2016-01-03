'use strict';

const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;
const MongoReplSet = require('mongodb').replSet;
const Promise = require('bluebird');

const Collection = require('lib/entities/collection');
const errors = require('lib/errors');

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
    _this.id = options.id;
    _this.name = options.name || 'test'; //TODO: validate name doesn't contain spaces
    _this.host = options.host || 'localhost';
    _this.port = options.port || 27017;
    _this.auth = options.auth || null;
    _this.connection = options.connection;

    _this.isOpen = false;

    _this.collections = [];

    let replicaSet = null;

    if (_this.replicaSet && _this.replicaSet.name && (_this.replicaSet.sets && _this.replicaSet.sets.length)) {
      let sets = [];

      _.each(_this.replicaSet.sets, (set) => {
        sets.push(new MongoServer(set.host, set.port));
      });

      replicaSet = new MongoReplSet(sets, {
        rs_name: _this.replicaSet.name // jshint ignore:line
      });
    }

    _this._dbConnection = new MongoDb(_this.name, replicaSet ? replicaSet : new MongoServer(_this.host, _this.port));
  }

  /**
   * @method open
   * @param {Function} next - callback function
   */
  open() {
    var _this = this;

    return new Promise((resolve, reject) => {
      _this._dbConnection.open((err) => {
        if (err) return reject(new errors.DatabaseError(err.message));

        if (_this.auth && _this.auth.username && _this.auth.password) {
          _this._dbConnection.authenticate(_this.auth.username, _this.auth.password, function(err) {
            if (err) return reject(new errors.DatabaseError(err.message));

            return resolve(null);
          });
        } else {
          return resolve(null);
        }
      });
    });
  }

  /**
   * @method listCollections
   */
  listCollections() {
    var _this = this;

    return new Promise((resolve, reject) => {
      if (!_this.open) return reject(new Error('Database is not open'));

      if (_this.collections && _this.collections.length) {
        return resolve(_this.collections);
      }

      _this._dbConnection.collections((err, collections) => {
        if (err) return reject(new errors.DatabaseError(err.message));

        _.each(collections, (collection) => {
          _this.addCollection({
            name: collection.collectionName
          });
        });

        return resolve(_this.collections);
      });
    });
  }

  /**
   * @method addCollection
   * @param {Object} options
   */
  addCollection(options) {
    options = options || {};

    var _this = this;

    var existingCollection = _.findWhere(_this.collections, {
      name: options.name
    });

    if (existingCollection) return;

    options.serverName = _this.host + ':' + _this.port;
    options.databaseName = _this.name;
    options.connection = _this.connection;
    options.database = _this;

    var collection = new Collection(_this._dbConnection, options);

    _this.collections.push(collection);

    return collection;
  }

  /**
   * @method drop
   */
  drop() {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this._dbConnection.dropDatabase(function(err) {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
}

/**
 * @exports
 */
module.exports = Database;
