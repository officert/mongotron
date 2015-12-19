'use strict';

angular.module('app').controller('notificationCtrl', [
  '$scope',
  function($scope) {
    if (!$scope.notification) throw new Error('notification directive - notification is required on scope');
  }
]);
