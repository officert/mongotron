angular.module('app').run([
  'keypressService',
  '$rootScope',
  function(keypressService, $rootScope) {
    keypressService.registerCommandHandler('connection-manager:new-connection', function() {
      $rootScope.showConnections();
    });
  }
]);
