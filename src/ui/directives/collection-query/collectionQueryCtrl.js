angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.loading = false;
    $scope.queryTime = null;

    const FIND_QUERY_FULL_REGEX = /^(?:find)\(([^]+)\)/; //extracts the query when it's a find query

    const UPDATE_QUERY_FULL_REGEX = /^(?:update)\(([^]+)\)/;

    const REMOVE_QUERY_FULL_REGEX = /^(?:remove)\(([^]+)\)/;

    const AGGREGATE_QUERY_FULL_REGEX = /^(?:aggregate)\(([^]+)\)/;

    $scope.codeEditorOptions = {};

    $scope.form = {
      searchQuery: 'find({})'
    };

    $scope.search = function search() {
      $scope.loading = true;
      $scope.error = null;

      var queryFn = getQueryTypeFn($scope.form.searchQuery);

      if (!queryFn) {
        $scope.error = 'Sorry, that is not a valid mongo query type';
        $scope.loading = false;
        return;
      }

      var searchQuery = convertSearchQueryToJsObject($scope.form.searchQuery);

      if (!searchQuery) {
        $scope.error = 'Sorry, that is not a valid mongo query';
        $scope.loading = false;
        return;
      }

      var startTime = performance.now();

      queryFn(searchQuery, function(err, results) {
        var endTime = performance.now();

        $timeout(function() {
          if (err) $scope.error = err;

          $scope.queryTime = (endTime - startTime).toFixed(5);

          $scope.loading = false;

          $scope.results = results;
        });
      });
    };

    $scope.search();

    function convertSearchQueryToJsObject(query) {

      var match;

      if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, FIND_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, UPDATE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, UPDATE_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, REMOVE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, REMOVE_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, AGGREGATE_QUERY_FULL_REGEX);
      } else {
        match = null;
      }

      if (!match) return null;

      try {
        match = $scope.$eval(match);
      } catch (err) {
        $scope.error = err && err.message ? err.message : err;
        $scope.loading = false;
      }
      return match;
    }

    function getQueryTypeFn(query) {
      if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
        return findQuery;
      } else if (matchesRegex(query, UPDATE_QUERY_FULL_REGEX)) {
        return updateQuery;
      } else if (matchesRegex(query, REMOVE_QUERY_FULL_REGEX)) {
        return removeQuery;
      } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
        return aggregateQuery;
      } else {
        return null;
      }
    }

    function matchesRegex(query, regex) {
      var match = query.match(regex);
      return match && match.length ? true : false;
    }

    function getRegexMatch(query, regex) {
      var matches = query.match(regex);
      return matches && matches.length > 1 ? matches[1] : null;
    }

    function findQuery(query, next) {
      $scope.collection.find(query, next);
    }

    function updateQuery(query, next) {
      $scope.collection.update(query, next);
    }

    function removeQuery(query, next) {
      $scope.collection.remove(query, next);
    }

    function aggregateQuery(aggregate, next) {
      $scope.collection.aggregate(aggregate, next);
    }
  }
]);
