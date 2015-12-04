angular.module('app').directive('queryExport', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/queryExport/queryExport.html',
      controller: 'queryExportCtrl',
      scope: {
        results: '='
      }
    };
  }
]);
