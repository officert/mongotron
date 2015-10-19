angular.module('app').service('modalService', [
  '$modal',
  '$uibModal',
  function($modal, $uibModal) {
    function ModalService() {

    }

    ModalService.prototype.openConnectionManager = function() {
      return $uibModal.open({
        templateUrl: __dirname + '/components/connect/connect.html',
        controller: 'connectCtrl'
      }).result;
    };

    ModalService.prototype.confirm = function confirm(options) {
      if (!options) throw new Error('options is required');

      return $uibModal.open({
        template: '<div class="modal-body" ng-bind-html="message"></div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" ng-click="cancel()">Cancel</button><button class="btn btn-primary" ng-click="ok()">' + (options.confirmButtonMessage || 'Confirm') + '</button>' +
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
      }).result;
    };

    return new ModalService();
  }
]);
