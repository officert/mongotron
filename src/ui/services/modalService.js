angular.module('app').service('modalService', [
  '$uibModal',
  '$uibModalStack',
  function($uibModal, $uibModalStack) {
    function ModalService() {}

    ModalService.prototype.openConnectionManager = function(page) {
      return openModal({
        templateUrl: __dirname + '/components/connect/connect.html',
        controller: 'connectCtrl',
        resolve: {
          page: [function() {
            return page;
          }]
        }
      });
    };

    ModalService.prototype.openAddDatabase = function(connection) {
      return openModal({
        templateUrl: __dirname + '/components/addDatabase/addDatabase.html',
        controller: 'addDatabaseCtrl',
        resolve: {
          connection: [function() {
            return connection;
          }]
        }
      });
    };

    ModalService.prototype.openAddCollection = function(database) {
      return openModal({
        templateUrl: __dirname + '/components/addCollection/addCollection.html',
        controller: 'addCollectionCtrl',
        resolve: {
          database: [function() {
            return database;
          }]
        }
      });
    };

    ModalService.prototype.confirm = function confirm(options) {
      if (!options) throw new Error('options is required');

      return openModal({
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
    };

    function closeAllModals() {
      $uibModalStack.dismissAll();
    }

    function openModal(opts) {
      if (!opts) return;

      closeAllModals();

      return $uibModal.open(opts);
    }

    return new ModalService();
  }
]);
