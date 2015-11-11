'use strict';

angular.module('app').controller('addCollectionCtrl', [
  '$scope',
  '$modalInstance',
  'database',
  'alertService',
  function($scope, $modalInstance, database, alertService) {

    $scope.close = function() {
      $modalInstance.close(1);
    };

    $scope.form = {};

    $scope.addCollection = function(addCollectionForm) {
      $scope.addCollectionFormSubmitted = true;

      if (!addCollectionForm.$valid) return;

      database.addCollection($scope.form);

      alertService.success('New collection added');

      $scope.close();
    };
  }
]);
