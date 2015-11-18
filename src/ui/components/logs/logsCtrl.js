angular.module('app').controller('logsCtrl', [
  '$scope',
  '$timeout',
  function($scope, $timeout) {
    const logger = require('lib/modules/logger');

    $scope.setTitle('Logs');

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
