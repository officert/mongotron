angular.module('app').factory('keypressHandler-connectionManager-newConnection', [
  'keypressService',
  '$rootScope',
  function(keypressService, $rootScope) {
    keypressService.registerHandler('connection-manager:new-connection', function() {
      $rootScope.showConnections();
    });
  }
]);
