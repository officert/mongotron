'use strict';

angular.module('app').controller('addConnectionCtrl', [
  '$scope',
  '$timeout',
  '$log',
  'notificationService',
  'connectionCache',
  function($scope, $timeout, $log, notificationService, connectionCache) {
    const connectionModule = require('lib/modules/connection');

    $scope.currentSubPage = 'connection';

    $scope.addConnectionForm = $scope.selectedConnection ? _.extend({}, $scope.selectedConnection) : {
      auth: {}
    };
    $scope.addConnectionFormSubmitted = false;

    $scope.addOrUpdateConnection = function(addConnectionForm) {
      $scope.addConnectionFormSubmitted = true;

      if (!addConnectionForm.$valid) return;

      if ($scope.selectedConnection) {
        $scope.editConnection();
      } else {
        $scope.addConnection();
      }
    };

    $scope.addConnection = function() {
      connectionModule.create($scope.addConnectionForm)
        .then(function() {
          $timeout(function() {
            $scope.changePage('list');

            notificationService.success('Connection added');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            notificationService.error({
              title: 'Error adding connection',
              message: err
            });
            $log.log(err);
          });
        });
    };

    $scope.editConnection = function() {
      connectionModule.update($scope.addConnectionForm.id, $scope.addConnectionForm)
        .then(function(connection) {
          $timeout(function() {
            connectionCache.updateById($scope.addConnectionForm.id, connection);

            $scope.changePage('list');

            notificationService.success('Connection updated');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            notificationService.error({
              title: 'Error updating connection',
              message: err
            });
            $log.log(err);
          });
        });
    };
  }
]);
