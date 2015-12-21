angular.module('app').controller('editDocumentCtrl', [
  '$scope',
  function($scope) {
    if (!$scope.collection) throw new Error('editDocumentCtrl - collection is required on scope');
  }
]);
