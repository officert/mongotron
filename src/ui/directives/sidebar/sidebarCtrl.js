angular.module('app').controller('sidebarCtrl', [
  '$scope',
  '$timeout',
  'alertService',
  // 'menuService',
  function($scope, $timeout, alertService) {

    _.each($scope.currentConnections, function(connection) {
      _collapseConnection(connection);
    });

    $scope.contextMenus = {
      SERVER: [{
        label: 'Disconnect',
        click: function(server) {
          console.log(arguments);
          console.log('DISCONNECT SERVER = ' + server.name);
        }
      }]
    };

    // menuService.registerContextMenu('SERVER', $scope.contextMenus.SERVER);

    //connections
    $scope.openConnection = function openConnection(connection) {
      if (!connection) return;

      if (!connection.isOpen) {
        connection.connect(function(err) {
          $timeout(function() {
            if (err) {
              alertService.error(err);
              connection.isOpen = false;
            } else {
              connection.isOpen = true;
            }
          });
        });
      } else {
        _collapseConnection(connection);
      }
    };

    //databases
    $scope.openDatabase = function openDatabase(database) {
      if (!database) return;

      if (!database.isOpen) {
        database.opening = true;
        database.open(function(err) {
          $timeout(function() {
            database.opening = false;

            if (err) {
              return alertService.error(err);
            }

            database.isOpen = true;
          });
        });
      } else {
        _collapseDatabase(database);
      }

      database.showFolders = !database.showFolders;
    };

    //collections
    $scope.openCollections = function openCollections(database) {
      if (!database) return;

      if (!database.collections || !database.collections.length) {
        database.loadingCollections = true;
        database.listCollections(function(err, collections) {
          $timeout(function() {
            database.loadingCollections = false;

            if (err) {
              return alertService.error(err);
            }

            database.collections = collections.map(function(collection) {
              collection.databaseName = database.name;
              collection.databaseHost = database.host;
              collection.databasePort = database.port;
              return collection;
            });
          });
        });
      }

      database.showCollections = !database.showCollections;

      $scope.activateItem(database);
    };

    $scope.activateItem = function activateItem(item, type) {
      if ($scope.currentActiveItem) {
        $scope.currentActiveItem.active = false;
      }
      $scope.currentActiveItem = item;
      $scope.currentActiveItem.active = true;

      switch (type) {
        case 'collection':
          _addQuery(item);
          break;
      }
    };

    function _addQuery(collection) {
      if (!collection) return;

      _deactivateCurrentQueries();

      var newQuery = {
        active: true,
        collection: collection
      };

      $timeout(function() {
        $scope.currentQueries.push(newQuery);
      });
    }

    function _collapseConnection(connection) {
      connection.isOpen = false;

      _.each(connection.databases, function(database) {
        _collapseDatabase(database);
      });
    }

    function _collapseDatabase(database) {
      database.isOpen = false;
    }

    function _deactivateCurrentQueries() {
      _.each($scope.currentQueries, function(query) {
        query.active = false;
      });
    }
  }
]);
