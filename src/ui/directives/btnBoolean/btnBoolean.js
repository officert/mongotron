angular.module('app').directive('btnBoolean', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/btnBoolean/btnBoolean.html',
      require: 'ngModel',
      scope: {
        trueValue: '=',
        falseValue: '='
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        scope.checked = false;

        if (!scope.trueValue) scope.trueValue = 'true';
        if (!scope.falseValue) scope.falseValue = 'false';

        //take initial model value and set editor with it
        ngModelCtrl.$formatters.push((modelValue) => {
          if (modelValue) scope.checked = true;
          else scope.checked = false;

          return modelValue;
        });

        scope.$watch('checked', (val) => {
          ngModelCtrl.$setViewValue(val);
        });
      }
    };
  }
]);
