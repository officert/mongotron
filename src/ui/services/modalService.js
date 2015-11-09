angular.module('app').service('modalService', [
  '$uibModal',
  function($uibModal) {
    // '$uibModal',
    // '$modalStack',
    // function($uibModal, $modalStack) {
    // var MODAL_CACHE = {}; //array of angular ui bootstrap modal promises

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

    // ModalService.prototype.confirm = function confirm(options) {
    //   if (!options) throw new Error('options is required');
    //
    //   var key = 'confirm';
    //   var existingModal = MODAL_CACHE[key];
    //
    //   var modalOptions = {
    //     template: '<div class="modal-body" ng-bind-html="message"></div>' +
    //       '<div class="modal-footer">' +
    //       '<button class="btn btn-default" ng-click="cancel()">Cancel</button><button class="btn btn-primary" ng-click="ok()">' + (options.confirmButtonMessage || 'Confirm') + '</button>' +
    //       '</div>',
    //     controller: [
    //       '$scope',
    //       '$modalInstance',
    //       function($scope, $modalInstance) {
    //         $scope.message = options.confirmMessage;
    //
    //         $scope.ok = function() {
    //           $uibModal.close(1);
    //         };
    //
    //         $scope.cancel = function() {
    //           $modalInstance.dismiss('cancel');
    //         };
    //       }
    //     ]
    //   };
    //
    //   if (existingModal) {
    //    if (!modalsExist()) {
    //       existingModal.open(modalOptions);
    //     }
    //     return existingModal;
    //   } else {
    //     var modal = $uibModal.open(modalOptions);
    //
    //     MODAL_CACHE[key] = modal;
    //
    //     return modal;
    //   }
    // };

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
