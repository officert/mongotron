angular.module('app').controller('collectionTabsCtrl', [
  '$scope',
  '$state',
  function($scope, $state) {
    if (!$scope.collections || !$scope.collections.length) throw new Error('collections is required for collection tabs directive');

    $scope.removeCollection = function(collection, $event) {
      if ($event) $event.preventDefault();

      var index = $scope.collections.indexOf(collection);

      if (index >= 0) {
        collection.active = false;
        $scope.collections.splice(index, 1);
      }

      if ($scope.collections.length === 0) {
        $state.go('data-viewer');
      }
    };
  }
]);
