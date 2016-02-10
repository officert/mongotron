'use strict';

angular.module('app').controller('aboutCtrl', [
  '$scope',
  ($scope) => {
    const appConfig = require('src/config/appConfig');

    $scope.version = appConfig.version;
  }
]);
