'use strict';

angular.module('app').controller('queryResultsExportCtrl', [
  '$scope',
  'dialogService',
  '$log',
  '$timeout',
  'alertService',
  function($scope, dialogService, $log, $timeout, alertService) {
    if (!$scope.collection) throw new Error('queryResultsExportCtrl - collection is required on scope');
    if (!$scope.query) throw new Error('queryResultsExportCtrl - query is required on scope');
    $scope.limit = $scope.limit || 50;

    const fs = require('fs');
    const csv = require('csv');

    const CsvStream = require('lib/utils/csvStream');

    $scope.keyValuePairs = [];

    $scope.handle = $scope.handle || {};
    $scope.handle.export = _export;
    $scope.handle.keyValuePairs = $scope.keyValuePairs;

    $scope.importSettings = _importSettings;
    $scope.exportSettings = _exportSettings;

    $scope.clearAll = function() {
      $scope.keyValuePairs.length = 0;
    };

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
          if (!path) return;

          path = _fixExportCsvPath(path);

          $timeout(() => {
            $scope.loading = true;

            $scope.collection.find($scope.query, {
                stream: true,
                limit: $scope.limit
              })
              .then((stream) => {
                stream
                  .pipe(new CsvStream(nameProps))
                  .on('error', handleError)
                  .pipe(fs.createWriteStream(path))
                  .on('error', handleError)
                  .on('finish', () => {
                    $timeout(() => {
                      $scope.loading = false;
                      alertService.success('Finished exporting');
                    });
                  });
              })
              .catch(handleError);
          });
        })
        .catch(handleError);
    }

    function _fixExportCsvPath(path) {
      if (path.indexOf('.csv') < 0) path += '.csv';
      return path;
    }

    function _exportSettings() {
      dialogService.showSaveDialog()
        .then((path) => {
          if (!path) return;

          path = _fixExportCsvPath(path);

          let data = '';

          _.each($scope.keyValuePairs, (kvp) => {
            data += (kvp.key + ',' + kvp.value + '\n');
          });

          $timeout(() => {
            $scope.loading = true;

            fs.writeFile(path, data, (err) => {
              $timeout(() => {
                $scope.loading = false;

                if (err) return handleError(err);

                alertService.success('Settings saved to : ' + path);
              });
            });
          });
        })
        .catch(handleError);
    }

    function _importSettings() {
      dialogService.showOpenDialog()
        .then((paths) => {
          if (!paths || !paths.length) return;

          $scope.keyValuePairs.length = 0;

          var parser = csv.parse();

          fs.createReadStream(paths[0])
            .on('error', handleError)
            .pipe(parser);

          parser
            .on('data', (chunk) => {
              console.log(chunk);

              $timeout(() => {
                if (chunk && chunk.length >= 2) {
                  $scope.keyValuePairs.push({
                    key: chunk[0],
                    value: chunk[1]
                  });
                }
              });
            })
            .on('error', handleError)
            .on('finish', () => {
              $timeout(() => {
                $scope.loading = false;

                alertService.success('Settings imported');
              });
            });
        })
        .catch(handleError);
    }

    function handleError(error) {
      $scope.loading = false;
      $log.error(error);
    }
  }
]);
