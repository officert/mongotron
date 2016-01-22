'use strict';

angular.module('app').directive('sidenav', [
  () => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/sidenav/sidenav.html',
      controller: 'sidenavCtrl'
    };
  }
]);
