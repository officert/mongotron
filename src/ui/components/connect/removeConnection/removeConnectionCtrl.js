'use strict';

angular.module('app').controller('removeConnectionCtrl', [
  '$scope',
  '$timeout',
  'notificationService',
  'connectionCache',
  function($scope, $timeout, notificationService, connectionCache) {
    const connectionModule = require('lib/modules/connection');

    $scope.removeConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      connectionModule.delete(connection.id)
        .then(() => {
          $timeout(() => {
            connectionCache.removeById(connection.id);

            $scope.changePage('list');

            notificationService.success('Connection removed');
          });
        })
        .catch((err) => {
          $timeout(() => {
            notificationService.error({
              title: 'Error removing connection',
              message: err
            });
          });
        });
    };
  }
]);
