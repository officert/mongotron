angular.module('app').directive('tabView', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/tabView/tabView.html',
      controller: 'tabViewCtrl'
    };
  }
]);
