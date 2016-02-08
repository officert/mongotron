'use strict';

angular.module('app').controller('addCollectionCtrl', [
  '$scope',
  '$uibModalInstance',
  'database',
  'notificationService', ($scope, $uibModalInstance, database, notificationService) => {
    const logger = require('lib/modules/logger');

    $scope.close = function() {
      $uibModalInstance.close(1);
    };

    $scope.form = {};

    $scope.addCollection = function(addCollectionForm) {
      $scope.addCollectionFormSubmitted = true;

      if (!addCollectionForm.$valid) return;

      database.addCollection($scope.form)
        .then(() => {
          notificationService.success('New collection added');

          $scope.close();
        })
        .catch(err => {
          logger.error(err);
        });
    };
  }
]);
