'use strict';

angular.module('app').controller('connectCtrl', [
  '$scope',
  '$uibModalInstance',
  'page',
  function($scope, $uibModalInstance, page) {
    $scope.listConnectionsSrc = __dirname + '/components/connect/listConnections/listConnections.html';
    $scope.addConnectionSrc = __dirname + '/components/connect/addConnection/addConnection.html';
    $scope.editConnectionSrc = __dirname + '/components/connect/editConnection/editConnection.html';
    $scope.removeConnectionSrc = __dirname + '/components/connect/removeConnection/removeConnection.html';

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
