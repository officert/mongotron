angular.module('app').controller('collectionQueryResultsViewCtrl', [
  '$scope',
  function($scope) {
    const mongoUtils = require('src/lib/utils/mongoUtils');

    if (!$scope.type) throw new Error('collection query results view - no type passed in scope');
    $scope.type = $scope.type.toLowerCase();

    $scope.keyValueResults = [];

    $scope.viewSrc = _getViewSrcByType($scope.type);

    $scope.$watch('results', function(val) {
      if (val) {
        $scope.keyValueResults = convertResultsToKeyValueResults(val);
      }
    });

    function _getViewSrcByType(type) {
      var listViewSrc = __dirname + '/directives/collectionQueryResultsView/views/listView.html';
      var keyvalueViewSrc = __dirname + '/directives/collectionQueryResultsView/views/keyvalueView.html';

      var src;

      switch (type) {
        case 'keyvalue':
          src = keyvalueViewSrc;
          break;
          // case 'list':
        default:
          src = listViewSrc;
          break;
      }

      return src;
    }

    function getPropertyType(property) {
      if (_.isNumber(property)) return 'number';
      if (_.isString(property)) return 'string';
      if (_.isArray(property)) return 'array';
      if (_.isDate(property)) return 'date';
      if (_.isBoolean(property)) return 'boolean';
      if (mongoUtils.isObjectId(property)) return 'objectId';
    }

    function convertResultsToKeyValueResults(results) {
      return results.map(function(result) {
        var props = [];
        props._id = result._id;

        for (var key in result) {
          //TODO: if it's a nested object then recurse and generate key/value for all of it's props
          props.push({
            _id: result[key] ? result[key]._id : result[key],
            key: key,
            value: result[key],
            type: getPropertyType(result[key])
          });
        }

        return props;
      });
    }
  }
]);
