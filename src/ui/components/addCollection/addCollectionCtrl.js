'use strict';

angular.module('app').controller('addCollectionCtrl', [
  '$scope',
  '$uibModalInstance',
  'database',
  'alertService',
  function($scope, $uibModalInstance, database, alertService) {

    $scope.close = function() {
      $uibModalInstance.close(1);
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
