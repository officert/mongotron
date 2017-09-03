'use strict';

angular.module('app').controller('addDatabaseCtrl', [
  '$scope',
  '$uibModalInstance',
  'connection',
  'notificationService',
  '$window',
  function($scope, $uibModalInstance, connection, notificationService, $window) {

    $scope.close = function() {
      $uibModalInstance.close(1);
    };

    $scope.form = {};

    $scope.addDatabase = function(addDatabaseForm) {
      $scope.addDatabaseFormSubmitted = true;

      if (!addDatabaseForm.$valid) return;

      connection.createDatabase($scope.form)
        .then(() => {
          notificationService.success('New database added');

          $scope.close();
        })
        .catch(error => {
          console.error(error);

          notificationService.error('Error creating a new database');
        });
    };

    $scope.setFocus = function() {
      setTimeout(function() {
        var collectionField = $window.document.getElementById('newDatabase');
        collectionField.focus();
      }, 100);
    }
  }
]);
