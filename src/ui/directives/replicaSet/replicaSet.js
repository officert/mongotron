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
          set: [{
            host: '',
            port: ''
          }]
        };

        //take initial model value and set editor with it
        ngModelCtrl.$formatters.push((modelValue) => {
          if (modelValue) {
            scope.replicaSet = modelValue;
            scope.replicaSet.set = scope.replicaSet.set || [];
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
