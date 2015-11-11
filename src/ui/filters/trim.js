angular.module('app').filter('trim', function() {
  return function(input) {
    if (!_.isString(input)) throw new Error('trim directive - input must be a string');

    return input.trim();
  };
});
