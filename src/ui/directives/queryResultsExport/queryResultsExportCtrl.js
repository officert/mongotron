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

    $scope.removeColumn = function(column) {
      if (!column) return;

      var index = $scope.keyValuePairs.indexOf(column);

      if (index > -1) {
        $scope.keyValuePairs.splice(index, 1);
      }
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
