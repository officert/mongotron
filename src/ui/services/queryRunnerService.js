'use strict';

angular.module('app').service('queryRunnerService', [
  '$timeout',
  'notificationService', ($timeout, notificationService) => {
    function QueryRunnerService() {}
    const Promise = require('bluebird');

    const queryModule = require('lib/modules/query');
    const keyValueUtils = require('src/lib/utils/keyValueUtils');

    QueryRunnerService.prototype.runQuery = function(rawQuery, collections) {
      let _this = this;

      return new Promise((resolve, reject) => {
        if (!rawQuery) return reject(new Error('QueryRunnerService - runQuery() - rawQuery is required'));
        if (!collections) return reject(new Error('QueryRunnerService - runQuery() - collections is required'));

        if (!queryModule.isValidQuery(rawQuery)) return reject(new Error('Sorry, ' + rawQuery + ' is not a valid query'));

        let collectionName = queryModule.parseCollectionName(rawQuery);

        let collection = _getCollectionByNameFromRawQuery(collectionName, collections);

        if (!collection) return reject(new Error('Sorry, ' + collectionName + ' is not a valid collection name'));

        let query;

        queryModule.createQuery(rawQuery)
          .then((_query) => {
            query = _query;
            return collection.execQuery(query);
          })
          .then((results) => {
            let queryResults = {
              time: results.time,
              result: results.result,
              query: query
            };

            if (queryResults.result && _.isArray(queryResults.result)) {
              queryResults.keyValueResults = keyValueUtils.convert(queryResults.result);
            }

            if (query.mongoMethod !== 'find' && query.mongoMethod !== 'aggregate' && query.mongoMethod !== 'count') {
              notificationService.success(query.mongoMethod + ' was successful');

              return _this.runQuery('db.' + collectionName + '.find()', collections)
                .then(resolve)
                .catch(reject);
            } else {
              return resolve(queryResults);
            }
          })
          .catch((err) => {
            return reject(err);
          });
      });
    };

    function _getCollectionByNameFromRawQuery(collectionName, collections) {
      if (!collectionName) return null;

      return _.find(collections, (collection) => {
        return collection.name && collection.name.toLowerCase && collection.name.toLowerCase() === collectionName.toLowerCase() ? true : false;
      });
    }

    return new QueryRunnerService();
  }
]);
