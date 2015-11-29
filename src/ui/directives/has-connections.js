angular.module('app').directive('hasConnections', [
  '$timeout',
  'connectionCache',
  function($timeout, connectionCache) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.addClass('no-connections');
        
        connectionCache.on(connectionCache.EVENTS.CONNECTION_CACHE_CHANGED, function(updatedCache) {
          if (updatedCache && updatedCache.length) {
            element.removeClass('no-connections');
          } else {
            element.addClass('no-connections');
          }
        });
      }
    };
  }
]);
