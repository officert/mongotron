'use strict';

angular.module('app').factory('utilsService', [
  function() {
    const ipcRenderer = require('electron').ipcRenderer;

    function UtilsService() {}

    UtilsService.prototype.setTitle = function(title) {
      ipcRenderer.send('set-title', title);
    };

    return new UtilsService();
  }
]);
