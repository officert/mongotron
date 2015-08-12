angular.module('app').config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/connect');
    $urlRouterProvider.otherwise('/connect');

    $stateProvider
      .state('connect', {
        url: '/connect',
        templateUrl: __dirname + '/components/connect/connect.html',
        controller: 'connectCtrl'
      })
      .state('data-viewer', {
        url: '/dataviewer',
        templateUrl: __dirname + '/components/dataViewer/dataViewer.html',
        controller: 'dataViewerCtrl'
      })
      .state('data-viewer.collections', {
        url: '/collections',
        templateUrl: __dirname + '/components/dataViewer/collections/collections.html',
        controller: 'collectionsCtrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: __dirname + '/components/home/home.html',
        controller: 'homeCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: __dirname + '/components/settings/settings.html',
        controller: 'settingsCtrl'
      });
  }
]);
