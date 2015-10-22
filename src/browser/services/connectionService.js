'use strict';

const connectionModule = require('lib/modules/connection');

angular.module('app').service('connectionService', [
  '$q',
  function($q) {
    return {
      create: function(options) {
        var deferred = $q.defer();

        connectionModule.create(options)
          .then(deferred.resolve)
          .catch(deferred.reject);

        return deferred.promise;
      },
      list: function() {
        var deferred = $q.defer();

        connectionModule.list()
          .then(deferred.resolve)
          .catch(deferred.reject);

        return deferred.promise;
      },
      delete: function(id) {
        var deferred = $q.defer();

        connectionModule.delete(id)
          .then(deferred.resolve)
          .catch(deferred.reject);

        return deferred.promise;
      }
    };
  }
]);
