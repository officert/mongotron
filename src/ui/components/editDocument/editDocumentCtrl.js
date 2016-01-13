angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  'queryRunnerService',
  'doc', ($scope, queryRunnerService, doc) => {
    $scope.doc = doc;

    $scope.saveChanges = () => {
      alert('save changes');

      queryRunnerService.runQuery('db.update({ id : ' + $scope.doc.id + ' })');
    };
  }
]);
