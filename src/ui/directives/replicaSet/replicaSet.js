'use strict';

angular.module('app').directive('replicaSet', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/replicaSet/replicaSet.html',
      require: 'ngModel',
      scope: {
        form: '=',
        formSubmitted: '='
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        scope.replicaSet = {
          servers: [{
            host: '',
            port: ''
          }]
        };

        scope.addSet = function($event) {
          if ($event) $event.preventDefault();

          scope.replicaSet.servers.push({
            host: '',
            port: ''
          });
        };

        scope.removeSet = function(set) {
          if (!set) return;

          let index = scope.replicaSet.servers.indexOf(set);

          if (index < 0) return;

          scope.replicaSet.servers.splice(index, 1);
        };

        //take initial model value and set editor with it
        ngModelCtrl.$formatters.push((modelValue) => {
          if (modelValue) {
            scope.replicaSet = modelValue;
            scope.replicaSet.servers = scope.replicaSet.servers || [];
          }

          return modelValue;
        });

        scope.$watch('replicaSet', (val) => {
          ngModelCtrl.$setViewValue(val);
        });
      }
    };
  }
]);
