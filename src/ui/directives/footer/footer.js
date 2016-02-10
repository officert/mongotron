'use strict';

angular.module('app').directive('mongotronFooter', [
  () => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/footer/footer.html',
      controller: 'footerCtrl'
    };
  }
]);
