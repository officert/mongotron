// 'use strict';
//
// const Collection = require('lib/entities/collection');
//
// const errors = require('lib/errors');
//
// /**
//  * @class Connection
//  */
// class Query {
//   /**
//    * @constructor Query
//    *
//    * @param {Object} collection
//    * @param {Object} options
//    * @param {String} options.name - name of the collection
//    * @param {String} options.serverName - name of the server
//    * @param {String} options.databaseName - name of the database
//    */
//   constructor(collection, options) {
//     if (!(collection instanceof Collection)) console.error('Query ctor - collection is not an instance of Collection');
//
//     options = options || {};
//
//     var _this = this;
//     _this._collection = collection;
//   }
//
//   /**
//    * @method find
//    * @param {Object} query - mongo query
//    * @param {Object} [options] - mongo query options
//    * @param {Function} next - callback function
//    */
//   find(query, options, next) {
//     if (arguments.length === 2) {
//       next = options;
//       options = {};
//     }
//     if (!query) return next(new errors.InvalidArugmentError('query is required'));
//
//     var _this = this;
//
//     options.limit = 50;
//
//     //TODO: validate the query??
//
//     _this._dbCollection.find(query, options).toArray(next);
//   }
//
//   /**
//    * @method remove
//    * @param {Object} query - mongo query
//    * @param {Object} [options] - mongo query options
//    * @param {Function} next - callback function
//    */
//   remove(query, options, next) {
//     if (arguments.length === 2) {
//       next = options;
//       options = {};
//     }
//     if (!query) return next(new errors.InvalidArugmentError('query is required'));
//
//     var _this = this;
//
//     options.limit = 50;
//
//     //TODO: validate the query??
//
//     _this._dbCollection.remove(query, options).toArray(next);
//   }
//
//   /**
//    * @method aggregate
//    * @param {Object} query - mongo query
//    * @param {Object} [options] - mongo query options
//    * @param {Function} next - callback function
//    */
//   aggregate(query, options, next) {
//     if (arguments.length === 2) {
//       next = options;
//       options = {};
//     }
//     if (!query) return next(new errors.InvalidArugmentError('query is required'));
//
//     var _this = this;
//
//     options.limit = 50;
//
//     //TODO: validate the query??
//
//     _this._dbCollection.aggregate(query, options).toArray(next);
//   }
// }
//
// /**
//  * @exports
//  */
// module.exports = Query;
