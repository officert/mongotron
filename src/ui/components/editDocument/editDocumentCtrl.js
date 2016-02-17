'use strict';

angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  '$uibModalInstance',
  'doc',
  'tabCache', ($scope, $uibModalInstance, doc, tabCache) => {
    // const esprima = require('esprima');
    // const escodegen = require('escodegen');

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

      try {
        let updates;

        try {
          updates = JSON.parse($scope.form.doc);
        } catch (err) {

        }

        delete updates._id; //can't update the ID

        $uibModalInstance.close(updates);
      } catch (err) {

      }
    };
  }
]);
