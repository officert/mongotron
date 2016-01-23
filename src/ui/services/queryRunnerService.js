'use strict';

angular.module('app').service('queryRunnerService', [
  () => {
    function QueryRunnerService() {}
    const Promise = require('bluebird');

    const evaluator = require('lib/modules/evaluator');

    QueryRunnerService.prototype.runQuery = function(rawQuery, collections) {
      return new Promise((resolve, reject) => {
        if (!rawQuery) return reject(new Error('QueryRunnerService - runQuery() - rawQuery is required'));
        if (!collections) return reject(new Error('QueryRunnerService - runQuery() - collections is required'));

        let evalScope = {
          db: {}
        };

        collections.forEach(collection => {
          evalScope.db[collection.name] = collection;
        });

        evaluator.eval(rawQuery, evalScope)
          .then(resolve)
          .catch(reject);
      });
    };

    return new QueryRunnerService();
  }
]);
