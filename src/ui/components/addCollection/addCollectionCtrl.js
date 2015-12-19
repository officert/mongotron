'use strict';

angular.module('app').controller('addCollectionCtrl', [
  '$scope',
  '$uibModalInstance',
  'database',
  'notificationService',
  function($scope, $uibModalInstance, database, notificationService) {

    $scope.close = function() {
      $uibModalInstance.close(1);
    };

    $scope.form = {};

    $scope.addCollection = function(addCollectionForm) {
      $scope.addCollectionFormSubmitted = true;

      if (!addCollectionForm.$valid) return;

      database.addCollection($scope.form);

      notificationService.success('New collection added');

      $scope.close();
    };
  }
]);
