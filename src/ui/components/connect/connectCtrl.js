'use strict';

angular.module('app').controller('connectCtrl', [
  '$scope',
  '$modalInstance',
  function($scope, $modalInstance) {
    $scope.listConnectionsSrc = __dirname + '/components/connect/listConnections/listConnections.html';
    $scope.addConnectionSrc = __dirname + '/components/connect/addConnection/addConnection.html';
    $scope.editConnectionSrc = __dirname + '/components/connect/editConnection/editConnection.html';
    $scope.removeConnectionSrc = __dirname + '/components/connect/removeConnection/removeConnection.html';

    $scope.currentPage = 'list';

    $scope.selectedConnection = null;

    $scope.close = function() {
      $modalInstance.close(1);
    };

    $scope.changePage = function(page, connection, $event) {
      if (!page) return;
      if ($event) $event.preventDefault();

      $scope.currentPage = page;

      if (connection) $scope.selectedConnection = connection;
    };
  }
]);
