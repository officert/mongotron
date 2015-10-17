'use strict';

const connectionService = require('lib/connectionService');

angular.module('app').service('connectionService', [
  '$q',
  function($q) {
    return {
      list: function() {
        var deferred = $q.defer();

        connectionService.list()
          .then(deferred.resolve)
          .catch(deferred.reject);

        return deferred.promise;
      }
    };
  }
]);
