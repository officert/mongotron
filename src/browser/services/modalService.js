angular.module('app').service('modalService', [
  '$modal',
  '$uibModal',
  function($modal, $uibModal) {
    function ModalService() {

    }

    ModalService.prototype.openConnectionManager = function() {
      return $uibModal.open({
        templateUrl:  __dirname + '/components/connect/connect.html',
        controller: 'connectCtrl'
      }).result;
    };

    return new ModalService();
  }
]);
