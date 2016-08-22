'use strict';

angular.module('app').service('localStorageService', [
  '$window', ($window) => {
    let CACHE = {};

    class LocalStorage {
      /** @method */
      /**
       * @desc get a value by key
       * @param {String} key
       * @return {String}
       */
      get(key) {
        if (!key) throw new Error('localStorageService - get() - key is required');

        let json;

        try {
          var val = $window.localStorage.getItem(key);
          if (val) json = JSON.parse(val);
        } catch (e) {}

        if (!json) json = CACHE[key];

        return json;
      }

      /** @method */
      /**
       * @desc set a value by key
       * @param {String} key
       * @param {Object} obj
       * @return null
       */
      set(key, value) {
        if (!key) throw new Error('localStorageService - set() - key is required');
        if (!value) throw new Error('localStorageService - set() - value is required');

        if (value) {
          try {
            var val = JSON.stringify(value);
            $window.localStorage.setItem(key, val);
          } catch (e) {
            CACHE[key] = value;
          }

          return null;
        } else {
          this.remove(key);
        }
      }

      /** @method */
      /**
       * @desc remove a value by key
       * @param {String} key
       * @return null
       */
      remove(key) {
        if (!key) throw new Error('localStorageService - remove() - key is required');

        try {
          $window.localStorage.removeItem(key);
        } catch (e) {
          delete CACHE[key];
        }

        return null;
      }

      /** @method */
      /**
       * @desc check if a value exists by key
       * @param {String} key
       * @return {Boolean}
       */
      exists(key) {
        if (!key) throw new Error('localStorageService - exists() - key is required');

        var exists = null;

        try {
          exists = this.get(key) !== null && this.get(key) !== undefined;
        } catch (e) {
          exists = CACHE[key] ? true : false;
        }

        return exists;
      }

      /** @method */
      /**
       * @return {Boolean}
       */
      clear() {
        var cleared = null;

        try {
          cleared = $window.localStorage.clear();
        } catch (e) {
          CACHE = {};
          cleared = true;
        }

        return cleared;
      }
    }

    return new LocalStorage();
  }
]);
