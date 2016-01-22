'use strict';

angular.module('app').directive('hasConnections', [
  '$timeout',
  'connectionCache', ($timeout, connectionCache) => {
    return {
      restrict: 'A',
      link: (scope, element) => {
        element.addClass('no-connections');

        connectionCache.on(connectionCache.EVENTS.CONNECTION_CACHE_CHANGED, (updatedCache) => {
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
