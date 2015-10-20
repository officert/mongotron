angular.module('app').config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/dataviewer');
    $urlRouterProvider.otherwise('/dataviewer');

    $stateProvider
      .state('data-viewer', {
        url: '/dataviewer',
        templateUrl: __dirname + '/components/dataViewer/dataViewer.html',
        controller: 'dataViewerCtrl'
      })
      .state('data-viewer.settings', {
        url: '/settings',
        templateUrl: __dirname + '/components/dataViewer/settings/settings.html',
        controller: 'settingsCtrl'
      })
      .state('data-viewer.collections', {
        url: '/collections',
        templateUrl: __dirname + '/components/dataViewer/collections/collections.html',
        controller: 'collectionsCtrl'
      });
  }
]);
