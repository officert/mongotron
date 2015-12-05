'use strict';

angular.module('app').directive('queryResultsExport', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/queryResultsExport/queryResultsExport.html',
      controller: 'queryResultsExportCtrl',
      scope: {
        handle: '=',
        collection: '=',
        query: '=',
        results: '='
      }
    };
  }
]);
