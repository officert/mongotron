angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.loading = false;
    $scope.queryTime = null;

    $scope.codeEditorOptions = {};

    $scope.form = {
      searchQuery: ''
    };

    $scope.search = function search() {
      $scope.loading = true;
      $scope.error = null;

      var searchQuery;

      try {
        searchQuery = $scope.$eval($scope.form.searchQuery);
      } catch (err) {
        $scope.error = err && err.message ? err.message : err;
        $scope.loading = false;
        return;
      }

      var startTime = performance.now();

      $scope.collection.find(searchQuery, function(err, results) {
        var endTime = performance.now();

        $timeout(function() {
          if (err) $scope.error = err;

          $scope.queryTime = (endTime - startTime).toFixed(5);

          $scope.loading = false;

          $scope.results = results;
        }, 500);
      });
    };

    $scope.search();

    // function convertToKeyValuPairs(obj) {
    //   var kvp = [];
    //
    //   for (var key in obj) {
    //     kvp.push({
    //       key: key,
    //       value: obj[key]
    //     });
    //   }
    //
    //   return kvp;
    // }
  }
]);
