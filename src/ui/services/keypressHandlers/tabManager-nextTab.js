angular.module('app').run([
  'keypressService',
  'tabCache',
  function(keypressService, tabCache) {
    keypressService.registerCommandHandler('tab-manager:next-tab', function() {
      tabCache.activateNext();
    });
  }
]);
