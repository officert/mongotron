angular.module('app').controller('tabViewCtrl', [
  '$scope',
  '$rootScope',
  function($scope, $rootScope) {
    $scope.closeTab = function(tab, $event) {
      if (!$event) $event.preventDefault();

      var index = $rootScope.currentTabs.indexOf(tab);

      if (index >= 0) {
        tab.active = false;
        $rootScope.currentTabs.splice(index, 1);
      }
    };

    $scope.removeQuery = function(query, $event) {
      if ($event) $event.preventDefault();

      var index = $rootScope.currentQueries.indexOf(query);

      if (index >= 0) {
        query.active = false;
        $rootScope.currentQueries.splice(index, 1);
      }
    };
  }
]);
