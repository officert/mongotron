const mongotron = require('src/mongotron');
const ipc = require('ipc');

angular.module('app', [
  'ngResource',
  'ui.bootstrap',
  'ui.router',
  'ngAnimate',
  'ngSanitize',
  'duScroll',
  'ui.codemirror'
]);

angular.module('app').constant('appConfig', {
  VERSION: '@@VERSION',
  ENV: '@@ENV'
});

angular.module('app').run([
  '$rootScope',
  '$state',
  '$stateParams',
  function($rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.currentConnections = [];

    // Page meta data defaults
    $rootScope.meta = {
      title: 'Mongotron'
    };

    $rootScope.setTitle = function(title) {
      ipc.send('set-title', title);
    };

    mongotron.init(function(err) {
      if (err) console.error(err);
    });
  }
]);
