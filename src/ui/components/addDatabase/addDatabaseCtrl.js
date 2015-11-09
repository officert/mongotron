'use strict';

angular.module('app').controller('addDatabaseCtrl', [
  '$scope',
  '$modalInstance',
  'connection',
  function($scope, $modalInstance, connection) {
    const connectionModule = require('lib/modules/connection');

    $scope.close = function() {
      $modalInstance.close(1);
    };

    $scope.form = {};

    $scope.addDatabase = function(addDatabaseForm) {
      if (addDatabaseForm.$valid) return;

      connection.addDatabase($scope.form);
    };
  }
]);
