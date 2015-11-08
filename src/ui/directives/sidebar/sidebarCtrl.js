angular.module('app').controller('sidebarCtrl', [
  '$scope',
  '$timeout',
  'alertService',
  'tabCache',
  'connectionCache',
  'EVENTS',
  'menuService',
  function($scope, $timeout, alertService, tabCache, connectionCache, EVENTS, menuService) {

    $scope.activeConnections = connectionCache.list();

    _.each($scope.activeConnections, function(connection) {
      _collapseConnection(connection);
    });

    connectionCache.on(EVENTS.CONNECTION_CACHE_CHANGED, function(updatedCache) {
      $scope.activeConnections = updatedCache;
    });

    //connections
    $scope.openConnectionContextMenu = function(connection) {
      if (!connection) return;

      menuService.showMenu([{
        label: 'New Database',
        click: function() {
          $timeout(function() {
            alert('New Database!!');
          });
        }
      }, {
        label: 'Disconnect',
        click: function() {
          $timeout(function() {
            connectionCache.removeByName(connection.name);
          });
        }
      }], {
        connection: connection
      });
    };

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
    $scope.openDatabaseContextMenu = function openDatabaseContextMenu(database, connection) {
      if (!database || !connection) return;

      menuService.showMenu([{
        label: 'New Collection',
        click: function() {
          $timeout(function() {
            alert('New Collection!!');
          });
        }
      }], {
        connection: connection
      });
    };

    $scope.openDatabase = function openDatabase(database, connection) {
      if (!database) return;

      if (!database.isOpen) {
        if (connection) { //collapse other databases with the same connection
          _.each(connection.databases, function(database) {
            _collapseDatabase(database);
          });
        }

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

      var queryTab = {
        type: tabCache.TYPES.QUERY,
        name: collection.name,
        collection: collection
      };

      $timeout(function() {
        tabCache.add(queryTab);
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
  }
]);
