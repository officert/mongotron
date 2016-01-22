'use strict';

angular.module('app').directive('tabView', [
  () => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/tabView/tabView.html',
      controller: 'tabViewCtrl'
    };
  }
]);
