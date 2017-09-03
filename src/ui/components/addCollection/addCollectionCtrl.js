'use strict';

angular.module('app').controller('addCollectionCtrl', [
  '$scope',
  '$uibModalInstance',
  'database',
  'notificationService',
  '$window', ($scope, $uibModalInstance, database, notificationService, $window) => {
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

    $scope.setFocus = function() {
      setTimeout(function() {
        var collectionField = $window.document.getElementById('newCollection');
        collectionField.focus();
      }, 100);
    }
  }
]);
