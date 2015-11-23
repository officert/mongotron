angular.module('app').directive('sidenav', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/sidenav/sidenav.html',
      controller: 'sidenavCtrl'
    };
  }
]);
