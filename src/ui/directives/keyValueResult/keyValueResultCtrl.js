'use strict';

angular.module('app').controller('keyValueResultCtrl', [
  '$scope',
  '$timeout',
  'menuService',
  'modalService',
  function($scope, $timeout, menuService, modalService) {
    if (!$scope.result) throw new Error('keyValueResult directive - result is required on scope');

    if ($scope.$parent.level !== null && $scope.$parent.level !== undefined) {
      $scope.level = parseInt($scope.$parent.level) + 1;
    } else {
      $scope.level = 1;
    }

    $scope.$on('collapse', function() {
      $scope.result.isOpen = false;
    });

    $scope.openDocumentContextMenu = function(doc) {
      if (!doc) return;

      menuService.showMenu([{
        label: 'Edit Document',
        click: function() {
          $timeout(function() {
            modalService.openEditDocument({
              editDocument: $scope.editDocument
            });
          });
        }
      }]);
    };
  }
]);
