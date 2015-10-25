angular.module('app').controller('tabViewCtrl', [
  '$scope',
  '$rootScope',
  function($scope, $rootScope) {
    $scope.tabs = [];

    $scope.closeTab = function(tab, $event) {
      if (!$event) $event.preventDefault();
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
