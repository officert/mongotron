'use strict';

angular.module('app').controller('keyValueResultsCtrl', [
  '$scope',
  '$timeout',
  'menuService', ($scope, $timeout, menuService) => {
    if (!$scope.results) throw new Error('keyValueResults directive - results is required on scope');

    $scope.openDocumentContextMenu = (doc) => {
      if (!doc) return;

      menuService.showMenu([{
        label: 'Edit Document',
        click: () => {
          $timeout(() => {
            $scope.editDocument(doc.original);
          });
        }
      }]);
    };
  }
]);
