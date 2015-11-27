'use strict';

angular.module('app').controller('editConnectionCtrl', [
  '$scope',
  '$timeout',
  '$log',
  'alertService',
  'connectionCache',
  function($scope, $timeout, $log, alertService, connectionCache) {
    const connectionModule = require('lib/modules/connection');

    $scope.editConnection = function(editConnectionForm) {
      if (!editConnectionForm.$valid) return;

      connectionModule.update($scope.selectedConnection.id, $scope.selectedConnection)
        .then(function(connection) {
          $timeout(function() {
            connectionCache.updateById($scope.selectedConnection.id, connection);

            $scope.selectedConnection = _.extend($scope.selectedConnection, connection);

            $scope.changePage('list');

            alertService.success('Connection updated');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            alertService.error(err);
            $log.log(err);
          });
        });
    };
  }
]);
