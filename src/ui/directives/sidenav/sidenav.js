'use strict';

angular.module('app').directive('mongotronSidenav', [
  () => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/sidenav/sidenav.html',
      controller: 'sidenavCtrl'
    };
  }
]);
