angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  '$timeout',
  '$rootScope',
  function($scope, $timeout, $rootScope) {
    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.loading = false;
    $scope.queryTime = null;

    //extraction regexes to pull out a valid mongo query object, or array (aggregate)
    const FIND_QUERY_FULL_REGEX = /^(?:find)\(([^]+)\)/;
    const UPDATE_QUERY_FULL_REGEX = /^(?:update)\(([^]+)\)/;
    const DELETE_MANY_QUERY_FULL_REGEX = /^(?:deleteMany)\(([^]+)\)/;
    const AGGREGATE_QUERY_FULL_REGEX = /^(?:aggregate)\(([^]+)\)/;
    const INSERT_ONE_QUERY_FULL_REGEX = /^(?:insertOne)\(([^]+)\)/;

    $scope.codeEditorOptions = {};

    $scope.form = {
      searchQuery: 'find({\n    \n})',
      skip: 0,
      limit: 50
    };

    $scope.VIEWS = {
      LIST: 'LIST',
      RAW: 'RAW'
    };
    $scope.currentView = $scope.VIEWS.RAW;

    $scope.editorHasFocus = false;

    $scope.$watch('editorHasFocus', function(val) {
      if (val) {
        $rootScope.currentQuery = {
          search: $scope.search
        };
      } else {
        $rootScope.currentQuery = null;
      }
    });

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

      var promise = queryFn(searchQuery, {
        skip: $scope.form.skip,
        limit: $scope.form.limit
      });

      promise.then(function(results) {
          var endTime = performance.now();

          $timeout(function() {
            $scope.queryTime = (endTime - startTime).toFixed(5);

            $scope.loading = false;

            $scope.results = results;
          });
        })
        .catch(function(err) {
          $scope.error = err;
        });
    };

    $scope.search();

    function convertSearchQueryToJsObject(query) {

      var match;

      if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, FIND_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, UPDATE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, UPDATE_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, DELETE_MANY_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, AGGREGATE_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, INSERT_ONE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, INSERT_ONE_QUERY_FULL_REGEX);
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
      } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
        return deleteManyQuery;
      } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
        return aggregateQuery;
      } else if (matchesRegex(query, INSERT_ONE_QUERY_FULL_REGEX)) {
        return insertOneQuery;
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

    function findQuery(query, options) {
      return $scope.collection.find(query, options);
    }

    function updateQuery(query) {
      return $scope.collection.update(query);
    }

    function deleteManyQuery(query) {
      return $scope.collection.deleteMany(query);
    }

    function aggregateQuery(aggregate) {
      return $scope.collection.aggregate(aggregate);
    }

    function insertOneQuery(doc, options) {
      return $scope.collection.insertOne(doc, options);
    }
  }
]);
