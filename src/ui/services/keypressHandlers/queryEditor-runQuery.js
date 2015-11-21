angular.module('app').run([
  'keypressService',
  '$rootScope',
  function(keypressService, $rootScope) {
    keypressService.registerCommandHandler('query-editor:run-query', function() {
      if ($rootScope.currentQuery && $rootScope.currentQuery.runQuery) {
        $rootScope.currentQuery.runQuery();
      }
    });
  }
]);
