'use strict';

angular.module('app').controller('connectCtrl', [
  '$scope',
  '$uibModalInstance',
  'page',
  'notificationService',
  function($scope, $uibModalInstance, page, notificationService) {
    $scope.listConnectionsSrc = __dirname + '/components/connect/listConnections/listConnections.html';
    $scope.addConnectionSrc = __dirname + '/components/connect/addConnection/addConnection.html';
    $scope.editConnectionSrc = __dirname + '/components/connect/editConnection/editConnection.html';
    $scope.removeConnectionSrc = __dirname + '/components/connect/removeConnection/removeConnection.html';

    try {
      JSON.parse('asdlknflks.{)))))}');
    } catch (err) {
      notificationService.error(err, 'Error');
    }

    notificationService.success('Yay something worked!!!!!', 'Success');
    notificationService.warning('Uh oh don\'t do that', 'Warning');
    notificationService.info('Yes do that thing', 'Info');

    $scope.currentPage = page || 'list';

    $scope.close = function() {
      $uibModalInstance.close(1);
    };

    $scope.changePage = function(page, connection, $event) {
      if (!page) return;
      if ($event) $event.preventDefault();

      $scope.selectedConnection = null;

      $scope.currentPage = page;

      if (connection) $scope.selectedConnection = connection;
    };
  }
]);
