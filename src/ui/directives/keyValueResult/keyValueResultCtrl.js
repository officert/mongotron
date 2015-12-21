'use strict';

angular.module('app').controller('keyValueResultCtrl', [
  '$scope',
  '$timeout',
  'menuService',
  'modalService',
  function($scope, $timeout, menuService, modalService) {
    if (!$scope.result) throw new Error('keyValueResult directive - result is required on scope');

    $scope.openDocumentContextMenu = function() {
      menuService.showMenu([{
        label: 'Edit Document',
        click: function() {
          $timeout(function() {
            modalService.openEditDocument({
              // collection: $scope.collection
            });
          });
        }
      }]);
    };
  }
]);
