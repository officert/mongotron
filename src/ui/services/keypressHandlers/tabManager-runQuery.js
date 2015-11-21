angular.module('app').run([
  'keypressService',
  '$rootScope',
  function(keypressService, $rootScope) {
    keypressService.registerCommandHandler('tab-manager:run-query', function() {
      if ($rootScope.currentQuery && $rootScope.currentQuery.runQuery) {
        $rootScope.currentQuery.runQuery();
      }
    });
  }
]);
