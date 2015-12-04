angular.module('app').controller('queryResultsExportCtrl', [
  '$scope',
  'dialogService',
  '$log',
  function($scope, dialogService, $log) {
    $scope.keyValuePairs = [];

    $scope.handle = $scope.handle || {};
    $scope.handle.export = _export;
    $scope.handle.saveConfig = _saveExportConfig;

    $scope.addColumn = function() {
      $scope.keyValuePairs.push({
        key: '',
        value: ''
      });
    };

    function _export() {
      dialogService.showSaveDialog()
        .then((path) => {
          alert(path);
        })
        .catch((err) => {
          $log.error(err);
        });
    }

    function _saveExportConfig() {
      dialogService.showSaveDialog()
        .then((path) => {
          alert(path);
        })
        .catch((err) => {
          $log.error(err);
        });
    }
  }
]);
