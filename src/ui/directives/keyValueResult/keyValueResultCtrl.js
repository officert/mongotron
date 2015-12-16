'use strict';

angular.module('app').controller('keyValueResultCtrl', [
  '$scope',
  function($scope) {
    $scope.deleteResult = _deleteResult;

    function _deleteResult() {
      alert('DELETE');
    }
  }
]);
