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
    const csv = require('csv');

    const CsvStream = require('lib/utils/csvStream');

    $scope.keyValuePairs = [];

    $scope.handle = $scope.handle || {};
    $scope.handle.export = _export;
    $scope.handle.import = _importExportConfig;
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
          if (!path) return;

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
                    $scope.exporting = false;

                    $log.error(error);
                  })
                  .pipe(fs.createWriteStream(path))
                  .on('error', (error) => {
                    $scope.exporting = false;

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
          if (!path) return;

          path = _fixExportCsvPath(path);

          let data = '';

          _.each($scope.keyValuePairs, (kvp) => {
            data += (kvp.key + ',' + kvp.value + '\n');
          });

          $timeout(() => {
            $scope.exporting = true;

            fs.writeFile(path, data, (err) => {
              $timeout(() => {
                $scope.exporting = false;

                if (err) {
                  $log.error(err);
                  return;
                }

                alertService.success('Export settings saved to : ' + path);
              });
            });
          });
        })
        .catch((err) => {
          $log.error(err);
        });
    }

    function _importExportConfig() {
      dialogService.showOpenDialog()
        .then((paths) => {
          if (!paths || !paths.length) return;

          var parser = csv.parse();

          fs.createReadStream(paths[0])
            .on('error', (error) => {
              $scope.exporting = false;

              $log.error(error);
            })
            .on('chunk', (chunk) => {
              console.log(chunk);
            })
            .pipe(parser);

          parser
            .on('chunk', (chunk) => {
              console.log(chunk);
            })
            .on('error', (error) => {
              $scope.exporting = false;

              $log.error(error);
            })
            .on('finish', () => {
              $timeout(() => {
                $scope.exporting = false;

                alertService.success('Export settings imported');
              });
            });

          parser.end();
        })
        .catch((err) => {
          $log.error(err);
        });
    }
  }
]);
