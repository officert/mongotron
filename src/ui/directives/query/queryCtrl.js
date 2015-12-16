'use strict';

angular.module('app').controller('queryCtrl', [
  '$scope',
  '$rootScope',
  'alertService',
  'modalService',
  function($scope, $rootScope, alertService, modalService) {
    const queryModule = require('lib/modules/query');
    const mongoUtils = require('src/lib/utils/mongoUtils');

    if (!$scope.database) throw new Error('database is required for database query directive');
    if (!$scope.database.collections || !$scope.database.collections.length) throw new Error('database must have collections for database query directive');

    $scope.loading = false;
    $scope.queryTime = null;
    $scope.editorHandle = {};
    $scope.codeEditorOptions = {};
    $scope.codeEditorCustomData = {
      collectionNames: _.pluck($scope.database.collections, 'name')
    };

    $scope.currentQuery = null;
    $scope.results = [];
    $scope.keyValueResults = [];

    $scope.deleteResult = _deleteResult;
    $scope.getPropertyTypeIcon = _getPropertyTypeIcon;

    let defaultCollection = $scope.defaultCollection ? _.findWhere($scope.database.collections, {
      name: $scope.defaultCollection
    }) : null;

    defaultCollection = defaultCollection || $scope.database.collections[0];

    let defaultQuery = 'db.' + defaultCollection.name.toLowerCase() + '.find({\n  \n})';

    $scope.changeTabName = function(name) {
      if (!name || !$scope.databaseTab) return;
      $scope.databaseTab.name = name.length > 20 ? (name.substring(0, 20) + '...') : name;
    };

    $scope.changeTabName(defaultQuery);

    $scope.form = {
      query: defaultQuery
    };

    $scope.runQuery = function() {
      _runQuery($scope.form.query);
    };

    $scope.VIEWS = {
      TEXT: 'TEXT',
      KEYVALUE: 'KEYVALUE'
    };
    $scope.currentView = $scope.VIEWS.KEYVALUE;

    _runQuery(defaultQuery);

    $scope.autoformat = function() {
      if ($scope.editorHandle.autoformat) {
        $scope.editorHandle.autoformat();
      }
    };

    $scope.editorHasFocus = false;

    $scope.$watch('editorHasFocus', function(val) {
      if (val) {
        //make some functions available on the root scope when the editor gets focus,
        //used for keybindings
        $rootScope.currentQuery = {
          runQuery: $scope.runQuery,
          autoformat: $scope.autoformat
        };
      } else {
        $rootScope.currentQuery = null;
      }
    });

    $scope.exportResults = function() {
      modalService.openQueryResultsExport($scope.currentCollection, $scope.currentQuery.query);
    };

    function _runQuery(rawQuery) {
      $scope.loading = true;
      $scope.error = null;

      $scope.changeTabName(rawQuery);

      if (!queryModule.isValidQuery(rawQuery)) {
        $scope.error = 'Sorry, ' + rawQuery + ' is not a valid query';
        $scope.loading = false;
        return;
      }

      let collectionName = queryModule.parseCollectionName(rawQuery);

      let collection = _getCollectionByNameFromRawQuery(collectionName);

      if (!collection) {
        $scope.error = 'Sorry, ' + collectionName + ' is not a valid collection name';
        $scope.loading = false;
        return;
      }

      $scope.currentCollection = collection;

      let query;

      queryModule.createQuery(rawQuery)
        .then((_query) => {
          query = _query;

          return collection.execQuery(query);
        })
        .then((result) => {
          $scope.$apply(() => {
            $scope.currentQuery = query;
            $scope.loading = false;
            $scope.queryTime = result.time;
            $scope.results = result.result;

            if ($scope.results && _.isArray($scope.results)) {
              $scope.keyValueResults = _convertResultsToKeyValueResults($scope.results);
            }

            if ($scope.currentQuery.mongoMethod !== 'find' &&
              $scope.currentQuery.mongoMethod !== 'aggregate' &&
              $scope.currentQuery.mongoMethod !== 'count') {
              alertService.success($scope.currentQuery.mongoMethod + ' was successful');

              _runQuery('db.' + $scope.currentCollection.name + '.find()');
            }
          });
        })
        .catch((error) => {
          $scope.$apply(() => {
            $scope.error = error && error.message ? error.message : error;
            $scope.loading = false;
          });
        });
    }

    function _deleteResult(result) {
      if (!result) return;

      modalService.confirm({
        message: 'Are you sure you want to delete this record?',
        confirmButtonMessage: 'Yes',
        cancelButtonMessage: 'No'
      }).result.then(function() {
        $scope.currentCollection.deleteById(result._id)
          .then(() => {
            $scope.$apply(() => {
              alertService.success('Delete successful');

              _runQuery('db.' + $scope.currentCollection.name + '.find()');
            });
          })
          .catch((error) => {
            $scope.$apply(() => {
              $scope.error = error && error.message ? error.message : error;
              $scope.loading = false;
            });
          });
      });
    }

    function _getCollectionByNameFromRawQuery(collectionName) {
      if (!collectionName) return null;

      return _.find($scope.database.collections, function(collection) {
        return collection.name && collection.name.toLowerCase && collection.name.toLowerCase() === collectionName.toLowerCase() ? true : false;
      });
    }

    function _getPropertyTypeIcon(propertyType) {
      let icon;

      switch (propertyType) {
        case 'number':
          icon = '';
          break;
        case 'string':
          icon = 'fa-quote-left';
          break;
        case 'boolean':
          icon = 'fa-calendar';
          break;
        case 'date':
          icon = 'fa-calendar';
          break;
        case 'array':
          icon = 'fa-calendar';
          break;
        case 'objectId':
          icon = 'fa-cog';
          break;
      }

      return icon;
    }

    function _convertResultsToKeyValueResults(results) {
      if (!results) return null;

      return results.map(function(result) {
        return _convertResultToKeyValueResult(result);
      });
    }

    function _convertResultToKeyValueResult(result) {
      if (!result) return null;

      let props = [];

      for (let key in result) {
        //TODO: if it's a nested object then recurse and generate key/value for all of it's props

        let value = result[key];
        let type = _getPropertyType(result[key]);
        let icon = _getPropertyTypeIcon(type);
        let results = null;
        let keyValueResults = null;

        if (type === 'array') {
          results = value;
          _convertResultsToKeyValueResults(results);
          value = 'Array[' + value.length + ']';
        } else if (type === 'object') {
          keyValueResults = _convertResultToKeyValueResult(value);
          value = 'Object{' + value.length + '}';
        }

        let newResult = {
          key: key,
          value: value,
          type: type,
          icon: icon
        };

        if (results) newResult.results = results;
        if (keyValueResults) newResult.keyValueResults = keyValueResults;

        props.push(newResult);
      }

      result.keyValueResults = props;

      return result;
    }

    function _getPropertyType(property) {
      if (_.isNumber(property)) return 'number';
      if (_.isString(property)) return 'string';
      if (_.isArray(property)) return 'array';
      if (_.isDate(property)) return 'date';
      if (_.isBoolean(property)) return 'boolean';
      if (mongoUtils.isObjectId(property)) return 'objectId';
    }
  }
]);
