angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.codeEditorOptions = {

    };

    $scope.form = {
      searchQuery: 'find()'
    };

    $scope.search = function search() {
      var searchQuery = $scope.$eval($scope.form.searchQuery);

      $scope.collection.find(searchQuery, function(err, results) {
        $timeout(function() {
          if (err) $scope.error = err;

          $scope.results = results;
        });
      });
    };
  }
]);
