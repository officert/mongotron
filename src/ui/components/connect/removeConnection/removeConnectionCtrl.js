'use strict';

angular.module('app').controller('removeConnectionCtrl', [
  '$scope',
  '$timeout',
  '$log',
  'notificationService',
  'connectionCache',
  function($scope, $timeout, $log, notificationService, connectionCache) {
    const connectionModule = require('lib/modules/connection');

    $scope.removeConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      connectionModule.delete(connection.id)
        .then(function() {
          $timeout(function() {
            var index = $scope.connections.indexOf(connection);

            if (index >= 0) $scope.connections.splice(index, 1);

            connectionCache.removeById(connection.id);

            $scope.changePage('list');

            notificationService.success('Connection removed');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            notificationService.error({
              title: 'Error removing connection',
              message: err
            });
            console.log(err);
          });
        });
    };
  }
]);
