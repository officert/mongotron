angular.module('app').controller('sidebarCtrl', [
  '$scope',
  '$timeout',
  'notificationService',
  'tabCache',
  'connectionCache',
  'menuService',
  'modalService',
  function($scope, $timeout, notificationService, tabCache, connectionCache, menuService, modalService) {
    const logger = require('lib/modules/logger');

    $scope.activeConnections = connectionCache.list();

    _.each($scope.activeConnections, function(connection) {
      _collapseConnection(connection);
    });

    connectionCache.on(connectionCache.EVENTS.CONNECTION_CACHE_CHANGED, function(updatedCache) {
      $scope.activeConnections = updatedCache;
    });

    //connections
    $scope.openConnectionContextMenu = function(connection) {
      if (!connection) return;

      menuService.showMenu([{
        label: 'New Database',
        click: function() {
          $timeout(function() {
            modalService.openAddDatabase(connection);
          });
        }
      }, {
        label: 'Disconnect',
        click: function() {
          $timeout(function() {
            connectionCache.removeById(connection.id);
            tabCache.removeByConnectionId(connection.id);
          });
        }
      }]);
    };

    $scope.openConnection = function openConnection(connection) {
      if (!connection) return;

      if (!connection.isOpen) {
        connection.connect(function(err) {
          $timeout(function() {
            if (err) {
              notificationService.error(err);
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
            modalService.openAddCollection(database);
          });
        }
      }, {
        label: 'Drop Database',
        click: function() {
          $timeout(function() {
            modalService.confirm({
              message: 'Are you sure you want to drop this collection?',
              confirmButtonMessage: 'Yes',
              cancelButtonMessage: 'No'
            }).result.then(function() {
              database.drop()
                .then(function() {
                  notificationService.success('Database dropped');

                  tabCache.removeByDatabase(database);

                  var index = connection.databases.indexOf(database);
                  if (index >= 0) {
                    connection.databases.splice(index, 1);
                  }
                })
                .catch(function(err) {
                  logger.error(err);
                  notificationService.error(err);
                });
            });
          });
        }
      }]);
    };

    $scope.openDatabaseCollectionFolderContextMenu = function openDatabaseCollectionFolderContextMenu(database, connection) {
      if (!database || !connection) return;

      menuService.showMenu([{
        label: 'New Collection',
        click: function() {
          $timeout(function() {
            modalService.openAddCollection(database);
          });
        }
      }]);
    };

    $scope.openDatabaseCollectionContextMenu = function openDatabaseCollectionContextMenu(collection, database) {
      if (!collection || !database) return;

      menuService.showMenu([{
        label: 'New Query',
        click: function() {
          $timeout(function() {
            $scope.activateItem(collection, 'collection');
          });
        }
      }, {
        label: 'Drop Collection',
        click: function() {
          $timeout(function() {
            modalService.confirm({
              message: 'Are you sure you want to drop this collection?',
              confirmButtonMessage: 'Yes',
              cancelButtonMessage: 'No'
            }).result.then(function() {
              collection.drop()
                .then(function() {
                  notificationService.success('Collection dropped');

                  tabCache.removeByCollection(collection);

                  var index = database.collections.indexOf(collection);
                  if (index >= 0) {
                    database.collections.splice(index, 1);
                  }
                })
                .catch(function(err) {
                  logger.error(err);
                  notificationService.error(err);
                });
            });
          });
        }
      }]);
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
              return notificationService.error(err);
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
              return notificationService.error(err);
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
        case 'query':
          _addQueryTab(item);
          break;
      }
    };

    function _addQueryTab(collection) {
      if (!collection || !collection.database) return;

      var queryTab = {
        type: tabCache.TYPES.QUERY,
        name: collection.database.name,
        database: collection.database,
        collection: collection,
        defaultCollection: collection.name
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
