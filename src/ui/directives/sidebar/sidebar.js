angular.module('app').directive('sidebar', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/sidebar/sidebar.html',
      controller: 'sidebarCtrl'
    };
  }
]);
