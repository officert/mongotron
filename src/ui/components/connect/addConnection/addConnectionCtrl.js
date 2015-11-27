'use strict';

angular.module('app').controller('addConnectionCtrl', [
  '$scope',
  '$timeout',
  '$log',
  'alertService',
  function($scope, $timeout, $log, alertService) {
    const connectionModule = require('lib/modules/connection');

    $scope.addConnectionForm = {
      auth: {}
    };
    $scope.addConnectionFormSubmitted = false;

    $scope.addConnection = function(addConnectionForm) {
      $scope.addConnectionFormSubmitted = true;

      if (!addConnectionForm.$valid) return;

      connectionModule.create($scope.addConnectionForm)
        .then(function() {
          $timeout(function() {
            $scope.changePage('list');

            alertService.success('Connection added');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            alertService.error(err);
            $log.log(err);
          });
        });
    };
  }
]);
