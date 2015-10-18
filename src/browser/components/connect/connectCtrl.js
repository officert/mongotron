angular.module('app').controller('connectCtrl', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'connectionService',
  '$log',
  function($scope, $rootScope, $modalInstance, connectionService, $log) {
    $scope.setTitle('MongoDb Connections');

    $scope.currentScreen = 'list';

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

    $scope.disconnect = function(connection) {
      if (!connection) return false;

      var index = $rootScope.currentConnections.indexOf(connection);

      if (index >= 0) {
        $rootScope.currentConnections.splice(index, 1);
      }
    };

    $scope.connect = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      if (!$scope.isConnected(connection)) {
        $rootScope.currentConnections.push(connection);
      } else {
        $scope.disconnect(connection);
      }
    };

    $scope.editConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();
    };

    $scope.removeConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();
    };
  }
]);
