angular.module('app').run([
  'keypressService',
  'tabCache',
  function(keypressService, tabCache) {
    keypressService.registerCommandHandler('tab-manager:close-active-tab', function() {
      tabCache.removeActive();
    });
  }
]);
