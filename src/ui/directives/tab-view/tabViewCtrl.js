angular.module('app').controller('tabViewCtrl', [
  '$scope',
  'tabCache',
  'EVENTS',
  function($scope, tabCache, EVENTS) {
    $scope.tabs = tabCache.list();

    $scope.TAB_TYPES = tabCache.TYPES;

    tabCache.on(EVENTS.TAB_CACHE_CHANGED, function(updatedCache) {
      $scope.tabs = updatedCache;
    });

    $scope.closeTab = function(tab, $event) {
      if ($event) $event.preventDefault();

      tabCache.remove(tab);
    };
  }
]);
