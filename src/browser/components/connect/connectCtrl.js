angular.module('app').controller('connectCtrl', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'connectionService',
  '$log',
  function($scope, $rootScope, $modalInstance, connectionService, $log) {
    $scope.setTitle('MongoDb Connections');

    $scope.connections = [];

    connectionService.list()
      .then(function(connections) {
        $scope.connections = connections;
      })
      .catch(function(response) {
        $log.error(response);
      });

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.isConnected = function(connection) {
      if (!connection) return false;

      var existingConnection = _.findWhere($rootScope.currentConnections, {
        name: connection.name
      });

      return existingConnection ? true : false;
    };

    $scope.connect = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      if (!$scope.isConnected(connection)) {
        $rootScope.currentConnections.push(connection);
      }
    };
  }
]);
