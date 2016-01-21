'use strict';

angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  'queryRunnerService',
  '$uibModalInstance',
  'doc',
  'tabCache',
  'notificationService', ($scope, queryRunnerService, $uibModalInstance, doc, tabCache, notificationService) => {
    // const mongoUtils = require('lib/utils/mongoUtils');

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

      let fullQuery = _getFullQuery(activeTab.collection.name);

      queryRunnerService.runQuery(fullQuery, activeTab.database.collections)
        .then(() => {})
        .catch((err) => {
          notificationService.error(err);
        });
    };

    function _getFullQuery(collectionName) {
      return `db.${collectionName}.updateOne({ id : ${$scope.doc._id.toString()} }, { $set : { ${$scope.inlineEditorKey} : ${$scope.newValue} } })`;
      // return 'db.' + collectionName + '.updateOne({ id : ' + $scope.doc._id.toString() + ' }, { $set : { ' + $scope.inlineEditorKey + ' : \'' + $scope.newValue + '\' } })';
    }
  }
]);
