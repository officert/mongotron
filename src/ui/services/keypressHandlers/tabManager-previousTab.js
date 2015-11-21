angular.module('app').run([
  'keypressService',
  'tabCache',
  function(keypressService, tabCache) {
    keypressService.registerCommandHandler('tab-manager:previous-tab', function() {
      tabCache.activatePrevious();
    });
  }
]);
