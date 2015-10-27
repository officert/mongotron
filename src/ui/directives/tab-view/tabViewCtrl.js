angular.module('app').controller('tabViewCtrl', [
  '$scope',
  'tabCache',
  'queryCache',
  'EVENTS',
  function($scope, tabCache, queryCache, EVENTS) {
    $scope.tabs = tabCache.list();
    $scope.queries = queryCache.list();

    queryCache.on(EVENTS.QUERY_CACHE_CHANGED, function(updatedCache) {
      $scope.queries = updatedCache;
    });

    tabCache.on(EVENTS.TAB_CACHE_CHANGED, function(updatedCache) {
      $scope.tabs = updatedCache;
    });

    $scope.closeTab = function(tab, $event) {
      if (!$event) $event.preventDefault();

      tabCache.remove(tab);
    };

    $scope.removeQuery = function(query, $event) {
      if ($event) $event.preventDefault();

      queryCache.remove(query);
    };
  }
]);
