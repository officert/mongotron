angular.module('app').service('modalService', [
  '$uibModal',
  function($uibModal) {
    function ModalService() {}

    ModalService.prototype.openConnectionManager = function(state) {
      var modal = $uibModal.open({
        templateUrl: __dirname + '/components/connect/connect.html',
        controller: 'connectCtrl',
        resolve: {
          state: [function() {
            return state;
          }]
        }
      });

      return modal;
    };

    ModalService.prototype.openAddDatabase = function(connection) {
      var modal = $uibModal.open({
        templateUrl: __dirname + '/components/addDatabase/addDatabase.html',
        controller: 'addDatabaseCtrl',
        resolve: {
          connection: [function() {
            return connection;
          }]
        }
      });

      return modal;
    };

    ModalService.prototype.openAddCollection = function(database) {
      var modal = $uibModal.open({
        templateUrl: __dirname + '/components/addCollection/addCollection.html',
        controller: 'addCollectionCtrl',
        resolve: {
          database: [function() {
            return database;
          }]
        }
      });

      return modal;
    };

    ModalService.prototype.confirm = function confirm(options) {
      if (!options) throw new Error('options is required');

      var modal = $uibModal.open({
        template: '<div class="modal-body">' + options.message + '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="cancel()">' + (options.cancelButtonMessage || 'Cancel') + '</button><button class="btn btn-primary" ng-click="ok()">' + (options.confirmButtonMessage || 'Confirm') + '</button>' +
          '</div>',
        controller: [
          '$scope',
          '$modalInstance',
          function($scope, $modalInstance) {
            $scope.message = options.confirmMessage;

            $scope.ok = function() {
              $modalInstance.close(1);
            };

            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };
          }
        ]
      });

      return modal;
    };

    // function modalsExist() {
    //   return !!$modalStack.getTop();
    // }
    //
    // function closeAllModals() {
    //   $modalStack.dismissAll();
    // }

    return new ModalService();
  }
]);
