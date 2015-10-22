angular.module('app').directive('tabView', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/tab-view/tabView.html',
      controller: 'tabViewCtrl'
    };
  }
]);
