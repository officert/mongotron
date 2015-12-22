'use strict';

angular.module('app').controller('keyValueResultCtrl', [
  '$scope',
  '$timeout',
  'menuService',
  function($scope, $timeout, menuService) {
    if (!$scope.result) throw new Error('keyValueResult directive - result is required on scope');

    if ($scope.$parent.level !== null && $scope.$parent.level !== undefined) {
      $scope.level = parseInt($scope.$parent.level) + 1;
    } else {
      $scope.level = 1;
    }

    console.log('level', $scope.level);

    $scope.openDocumentContextMenu = function(doc) {
      if (!doc) return;

      menuService.showMenu([{
        label: 'Edit Document',
        click: function() {
          $timeout(function() {
            alert('Edit Document');
          });
        }
      }]);
    };
  }
]);
