'use strict';

angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  'queryRunnerService',
  '$uibModalInstance',
  'doc',
  'tabCache',
  'notificationService', ($scope, queryRunnerService, $uibModalInstance, doc, tabCache, notificationService) => {
    $scope.doc = doc;

    $scope.close = function() {
      $uibModalInstance.dismiss();
    };

    $scope.saveChanges = () => {
      let activeTab = tabCache.getActive();

      if (!activeTab) return;

      let fullQuery = _getFullQuery(activeTab.collection.name);

      queryRunnerService.runQuery(fullQuery, activeTab.database.collections)
        .then(() => {
          notificationService.success('yay!!');
        })
        .catch((err) => {
          notificationService.error(err);
        });
    };

    function _getFullQuery(collectionName) {
      return 'db.' + collectionName + '.updateOne({ id : ' + $scope.doc._id.toString() + ' }, { $set : { ' + $scope.inlineEditorKey + ' : \'' + $scope.newValue + '\' } })';
    }
  }
]);
