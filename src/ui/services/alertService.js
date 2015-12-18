angular.module('app').factory('alertService', [
  function() {

    function AlertService() {
      toastr.options.closeButton = true;
      toastr.options.closeHtml = '<button><i class="icon-times"></i></button>';
    }

    AlertService.prototype.warning = function warning(message) {
      toastr.warning(message);
    };

    AlertService.prototype.success = function success(message) {
      toastr.success(message);
    };

    AlertService.prototype.error = function error(err) {
      if (_.isString(err)) {
        toastr.error(err);
      } else if (err && err.message) {
        toastr.error(err.message);
      } else {
        toastr.error('Error');
      }
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
