angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  'queryRunnerService', ($scope, queryRunnerService) => {
    $scope.saveChanges = () => {
      alert('save changes');

      queryRunnerService.runQuery();
    };
  }
]);
