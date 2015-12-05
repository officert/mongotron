angular.module('app').controller('queryResultsViewCtrl', [
  '$scope',
  function($scope) {
    const mongoUtils = require('src/lib/utils/mongoUtils');
    $scope.getPropertyTypeIcon = _getPropertyTypeIcons;

    if (!$scope.type) throw new Error('query results view - no type passed in scope');
    $scope.type = $scope.type.toLowerCase();

    $scope.keyValueResults = [];

    $scope.viewSrc = _getViewSrcByType($scope.type);

    $scope.$watch('results', function(val) {
      if (val) {
        $scope.keyValueResults = _convertResultsToKeyValueResults(val);
      }
    });

    function _getViewSrcByType(type) {
      var listViewSrc = __dirname + '/directives/queryResultsView/views/listView.html';
      var keyvalueViewSrc = __dirname + '/directives/queryResultsView/views/keyvalueView.html';

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

    function _getPropertyType(property) {
      if (_.isNumber(property)) return 'number';
      if (_.isString(property)) return 'string';
      if (_.isArray(property)) return 'array';
      if (_.isDate(property)) return 'date';
      if (_.isBoolean(property)) return 'boolean';
      if (mongoUtils.isObjectId(property)) return 'objectId';
    }

    function _convertResultsToKeyValueResults(results) {
      return results.map(function(result) {
        var props = [];
        props._id = result._id;

        for (var key in result) {
          //TODO: if it's a nested object then recurse and generate key/value for all of it's props
          props.push({
            _id: result[key] ? result[key]._id : result[key],
            key: key,
            value: result[key],
            type: _getPropertyType(result[key])
          });
        }

        return props;
      });
    }

    function _getPropertyTypeIcons(propertyType) {
      var icon;

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
  }
]);
