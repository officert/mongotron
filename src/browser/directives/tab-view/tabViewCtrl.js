angular.module('app').controller('tabViewCtrl', [
  '$scope',
  '$rootScope',
  function($scope, $rootScope) {
    $scope.tabs = [];

    $scope.closeTab = function(tab, $event) {
      if (!$event) $event.preventDefault();
    };

    $scope.removeCollection = function(collection, $event) {
      if ($event) $event.preventDefault();

      var index = $rootScope.currentCollections.indexOf(collection);

      if (index >= 0) {
        collection.active = false;
        $rootScope.currentCollections.splice(index, 1);
      }
    };
  }
]);
