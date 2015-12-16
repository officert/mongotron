'use strict';

angular.module('app').controller('addDatabaseCtrl', [
  '$scope',
  '$uibModalInstance',
  'connection',
  'alertService',
  function($scope, $uibModalInstance, connection, alertService) {

    $scope.close = function() {
      $uibModalInstance.close(1);
    };

    $scope.form = {};

    $scope.addDatabase = function(addDatabaseForm) {
      $scope.addDatabaseFormSubmitted = true;

      if (!addDatabaseForm.$valid) return;

      connection.addDatabase($scope.form);

      alertService.success('New database added');

      $scope.close();
    };
  }
]);
