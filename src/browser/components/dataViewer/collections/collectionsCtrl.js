angular.module('app').controller('collectionsCtrl', [
  '$scope',
  '$state',
  function($scope, $state) {
    if (!$scope.currentCollections || !$scope.currentCollections.length) {
      $state.go('data-viewer');
    }
  }
]);
