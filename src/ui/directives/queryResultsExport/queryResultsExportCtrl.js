'use strict';

angular.module('app').controller('queryResultsExportCtrl', [
  '$scope',
  'dialogService',
  '$log',
  '$timeout',
  'alertService',
  function($scope, dialogService, $log, $timeout, alertService) {
    if (!$scope.collection) throw new Error('queryResultsExportCtrl - collection is required on scope');
    if (!$scope.results) throw new Error('queryResultsExportCtrl - results is required on scope');
    if (!$scope.query) throw new Error('queryResultsExportCtrl - query is required on scope');

    const fs = require('fs');
    const CsvStream = require('lib/utils/csvStream');

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
      let nameProps = $scope.keyValuePairs.map((kvp) => {
        return {
          name: kvp.key,
          property: kvp.value
        };
      });

      dialogService.showSaveDialog()
        .then((path) => {
          path = _fixExportCsvPath(path);

          $timeout(() => {
            $scope.exporting = true;

            $scope.collection.find($scope.query, {
                stream: true
              })
              .then((stream) => {
                stream
                  .pipe(new CsvStream(nameProps))
                  .on('error', (error) => {
                    $log.error(error);
                  })
                  .pipe(fs.createWriteStream(path))
                  .on('error', (error) => {
                    $log.error(error);
                  })
                  .on('finish', () => {
                    $timeout(() => {
                      $scope.exporting = false;
                      alertService.success('Finished exporting');
                    });
                  });
              })
              .catch((error) => {
                $log.error(error);
              });
          });
        })
        .catch((err) => {
          $log.error(err);
        });
    }

    function _fixExportCsvPath(path) {
      if (path.indexOf('.csv') < 0) path += '.csv';
      return path;
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
