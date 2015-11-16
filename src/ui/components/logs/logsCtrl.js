angular.module('app').controller('logsCtrl', [
  '$scope',
  function($scope) {
    const logger = require('lib/modules/logger');

    $scope.setTitle('Logs');

    logger.list()
      .then(function(logs) {
        $scope.logs = logs;
      })
      .catch(function(err) {
        logger.error(err);
      });
  }
]);
