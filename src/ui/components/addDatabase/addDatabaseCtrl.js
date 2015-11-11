'use strict';

angular.module('app').controller('addDatabaseCtrl', [
  '$scope',
  '$modalInstance',
  'connection',
  'alertService',
  function($scope, $modalInstance, connection, alertService) {

    $scope.close = function() {
      $modalInstance.close(1);
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
