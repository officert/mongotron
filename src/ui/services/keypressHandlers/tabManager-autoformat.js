angular.module('app').run([
  'keypressService',
  '$rootScope',
  function(keypressService, $rootScope) {
    keypressService.registerCommandHandler('tab-manager:autoformat', function() {
      if ($rootScope.currentQuery && $rootScope.currentQuery.autoformat) {
        $rootScope.currentQuery.autoformat();
      }
    });
  }
]);
