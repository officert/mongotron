angular.module('app').controller('logsCtrl', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    const logger = require('lib/modules/logger');

    logger.list()
      .then(function(logs) {
        $timeout(function() {
          $scope.logs = logs && logs.file ? logs.file : [];
        });
      })
      .catch(function(err) {
        logger.error(err);
      });
  }
]);
