angular.module('ng-bs-animated-button', []);

angular.module('ng-bs-animated-button', []).directive('ngBsAnimatedButton', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        isSubmitting: '=',
        result: '=',
        options: '=?'
      },
      controller: function($scope) {
        $scope.options = $scope.options || {};
        $scope.options = {
          buttonDefaultClass: $scope.options.buttonDefaultClass || 'btn-primary',
          buttonSubmittingClass: $scope.options.buttonSubmittingClass || 'btn-primary',
          buttonSuccessClass: $scope.options.buttonSuccessClass || 'btn-primary',
          buttonErrorClass: $scope.options.buttonErrorClass || 'btn-danger',
          buttonSizeClass: $scope.options.buttonSizeClass || null,
          buttonDefaultText: $scope.options.buttonDefaultText || 'Submit',
          buttonSubmittingText: $scope.options.buttonSubmittingText || 'Submitting...',
          buttonSuccessText: $scope.options.buttonSuccessText || 'Completed',
          buttonErrorText: $scope.options.buttonErrorText || 'There was an error',
          buttonSubmittingIcon: $scope.options.buttonSubmittingIcon || 'glyphicon glyphicon-refresh',
          buttonSuccessIcon: $scope.options.buttonSuccessIcon || 'glyphicon glyphicon-ok',
          buttonErrorIcon: $scope.options.buttonErrorIcon || 'glyphicon glyphicon-remove',
          buttonDefaultIcon: $scope.options.buttonDefaultIcon || '',
          formIsInvalid: $scope.options.formIsInvalid || '',
          animationCompleteTime: $scope.options.animationCompleteTime || '2000',
          iconsPosition: $scope.options.iconsPosition || 'left'
        };
      },
      template: '<button type="submit" class="btn {{buttonClass}} {{buttonSize}} btn-ng-bs-animated clearfix" ng-disabled="{{formIsInvalid}}">' + '<div class="icons pull-{{iconsPosition}}">' + '<span class="{{buttonDefaultIcon}} icon-default"></span>' + '<span class="{{buttonSubmittingIcon}} icon-spinner icon-submit hidden"></span>' + '<span class="{{buttonSuccessIcon}} icon-result icon-success hidden"></span>' + '<span class="{{buttonErrorIcon}} icon-result icon-error hidden"></span>' + '</div>' + '<div class="text {{buttonTextFloatClass}}">{{buttonText}}</div>' + '</button>',
      link: function(scope, element) {
        var el = element;

        var icons = {
          default: angular.element(el[0].querySelector('.icon-default')),
          submitting: angular.element(el[0].querySelector('.icon-submit')),
          result: angular.element(el[0].querySelectorAll('.icon-result')),
          success: angular.element(el[0].querySelector('.icon-success')),
          error: angular.element(el[0].querySelector('.icon-error'))
        };

        var endAnimation = function() {
          scope.result = null;
          scope.buttonClass = scope.options.buttonDefaultClass;
          scope.buttonText = scope.options.buttonDefaultText;
          icons.default.removeClass('hidden');
          el.removeClass('is-active').attr('disabled', false);
          icons.result.addClass('hidden');
        };

        var setButtonTextFloatClass = function() {
          if (scope.iconsPosition === 'left') {
            return 'pull-right';
          } else {
            return 'pull-left';
          }
        };

        scope.buttonClass = scope.options.buttonDefaultClass;
        scope.buttonSize = scope.options.buttonSizeClass;
        scope.formIsInvalid = scope.options.formIsInvalid;
        scope.iconsPosition = scope.options.iconsPosition;
        scope.buttonSubmittingIcon = scope.options.buttonSubmittingIcon;
        scope.buttonDefaultIcon = scope.options.buttonDefaultIcon;
        scope.buttonSuccessIcon = scope.options.buttonSuccessIcon;
        scope.buttonErrorIcon = scope.options.buttonErrorIcon;
        scope.iconsPosition = scope.options.iconsPosition;
        scope.buttonText = scope.options.buttonDefaultText;
        scope.buttonTextFloatClass = setButtonTextFloatClass();

        scope.$watch('isSubmitting', function(newValue) {
          if (newValue) {
            scope.buttonClass = scope.options.buttonSubmittingClass;
            scope.buttonText = scope.options.buttonSubmittingText;
            el.attr('disabled', true).addClass('is-active');
            icons.submitting.removeClass('hidden');
            icons.default.addClass('hidden');
          }
        }, true).bind(this);

        scope.$watch('result', function(newValue) {
          scope.isSubmitting = null;
          if (newValue === 'success') {
            scope.buttonClass = scope.options.buttonSuccessClass;
            scope.buttonText = scope.options.buttonSuccessText;
            icons.submitting.addClass('hidden');
            icons.success.removeClass('hidden');
            $timeout(endAnimation, scope.options.animationCompleteTime);
          }
          if (newValue === 'error') {
            scope.buttonClass = scope.options.buttonErrorClass;
            scope.buttonText = scope.options.buttonErrorText;
            icons.submitting.addClass('hidden');
            icons.error.removeClass('hidden');
            $timeout(endAnimation, scope.options.animationCompleteTime);
          }
        }, true).bind(this);
      }
    };
  }
]);
