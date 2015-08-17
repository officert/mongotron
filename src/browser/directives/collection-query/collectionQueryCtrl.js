angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.loading = false;

    $scope.codeEditorOptions = {

    };

    $scope.form = {
      searchQuery: '{}'
    };

    $scope.search = function search() {
      $scope.loading = true;

      var searchQuery = $scope.$eval($scope.form.searchQuery);

      $scope.collection.find(searchQuery, function(err, results) {
        $timeout(function() {
          if (err) $scope.error = err;

          $scope.loading = false;

          $scope.results = results.map(function(result) {
            result.properties = convertToKeyValuPairs(result);
            return result;
          });
        }, 500);
      });
    };

    $scope.search();

    function convertToKeyValuPairs(obj) {
      var kvp = [];

      for (var key in obj) {
        kvp.push({
          key: key,
          value: obj[key]
        });
      }

      return kvp;
    }
  }
]);
