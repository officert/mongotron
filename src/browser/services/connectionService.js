const connectionService = require('lib/connectionService');

angular.module('app').service('connectionService', [
  '$q',
  function($q) {

    function ConnectionService() {}

    ConnectionService.prototype.list = function list() {
      var deffered = $q.defer();

      connectionService.list(function(err, connections) {
        if (err) return deffered.reject(err);

        return deffered.resolve(connections);
      });

      return deffered.promise;
    };

    return new ConnectionService();
  }
]);
