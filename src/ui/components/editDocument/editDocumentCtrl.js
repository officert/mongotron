angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  'queryRunnerService',
  '$uibModalInstance',
  'doc',
  'collection',
  'collections', ($scope, queryRunnerService, $uibModalInstance, doc, collection, collections) => {
    $scope.doc = doc;
    $scope.collection = collection;
    $scope.collections = collections;

    $scope.close = function() {
      $uibModalInstance.close(1);
    };

    $scope.saveChanges = () => {
      alert('save changes');

      queryRunnerService.runQuery('db.' + collection.name + 'update({ id : ' + $scope.doc.id + ' })', $scope.collections)
        .then(() => {

        });
    };
  }
]);
