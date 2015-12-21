'use strict';

angular.module('app').controller('keyValueResultCtrl', [
  '$scope',
  '$timeout',
  'menuService',
  function($scope, $timeout, menuService) {
    if (!$scope.result) throw new Error('keyValueResult directive - result is required on scope');

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
