'use strict';

angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  '$uibModalInstance',
  'doc',
  'tabCache', ($scope, $uibModalInstance, doc, tabCache) => {
    $scope.doc = doc;

    //editor
    $scope.editorHandle = {};
    $scope.codeEditorOptions = {};
    $scope.editorHasFocus = false;

    $scope.form = {
      doc: JSON.stringify($scope.doc, null, 4)
    };

    let activeTab = tabCache.getActive();

    if (!activeTab) throw new Error('editDocumentCtrl - no active tab');

    $scope.codeEditorCustomData = {
      collectionNames: _.pluck(activeTab.database.collections, 'name')
    };

    $scope.close = function() {
      $uibModalInstance.dismiss();
    };

    $scope.refresh = function() {
      $scope.editorHandle.refresh();
    };

    $scope.saveChanges = () => {
      if (!activeTab) return;

      //TODO : pass updates

      $uibModalInstance.close();
    };
  }
]);
