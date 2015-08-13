angular.module('app').factory('alertService', [
  function() {

    function AlertService() {
      toastr.options.closeButton = true;
    }

    AlertService.prototype.warning = function warning(message) {
      toastr.warning(message);
    };

    AlertService.prototype.success = function success(message) {
      toastr.success(message);
    };

    AlertService.prototype.error = function error(error) {
      toastr.error(error.message);
    };

    AlertService.prototype.info = function info(message) {
      toastr.info(message);
    };

    AlertService.prototype.clear = function warning(message) {
      toastr.clear(message);
    };

    return new AlertService();
  }
]);
