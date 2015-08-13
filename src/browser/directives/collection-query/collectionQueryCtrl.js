angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  function($scope) {
    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.form = {
      searchQuery: ''
    };

    $scope.search = function search() {
      $scope.form.searchQuery = JSON.stringify($scope.form.searchQuery, null, 4);
    };


  }
]);
