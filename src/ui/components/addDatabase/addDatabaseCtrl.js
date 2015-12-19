'use strict';

angular.module('app').controller('addDatabaseCtrl', [
  '$scope',
  '$uibModalInstance',
  'connection',
  'notificationService',
  function($scope, $uibModalInstance, connection, notificationService) {

    $scope.close = function() {
      $uibModalInstance.close(1);
    };

    $scope.form = {};

    $scope.addDatabase = function(addDatabaseForm) {
      $scope.addDatabaseFormSubmitted = true;

      if (!addDatabaseForm.$valid) return;

      connection.addDatabase($scope.form);

      notificationService.success('New database added');

      $scope.close();
    };
  }
]);
