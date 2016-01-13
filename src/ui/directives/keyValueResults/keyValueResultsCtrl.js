'use strict';

angular.module('app').controller('keyValueResultsCtrl', [
  '$scope',
  '$timeout',
  'menuService',
  'modalService', ($scope, $timeout, menuService, modalService) => {
    if (!$scope.results) throw new Error('keyValueResults directive - results is required on scope');

    $scope.openDocumentContextMenu = (doc) => {
      if (!doc) return;

      menuService.showMenu([{
        label: 'Edit Document',
        click: () => {
          $timeout(() => {
            modalService.openEditDocument();
          });
        }
      }]);
    };
  }
]);
