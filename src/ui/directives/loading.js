'use strict';

angular.module('app').directive('loading', [
  () => {
    return {
      restrict: 'E',
      replace: true,
      template: '<p class="loading center" ng-show="loading"><span><i class="fa fa-cog fa-spin fa-2x"></i></span></p>',
      scope: {
        loading: '='
      }
    };
  }
]);
