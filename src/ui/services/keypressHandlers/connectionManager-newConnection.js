angular.module('app').run([
  'keypressService',
  'navUtils',
  function(keypressService, navUtils) {
    keypressService.registerCommandHandler('connection-manager:new-connection', function() {
      navUtils.showConnections();
    });
  }
]);
