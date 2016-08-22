'use strict';

angular.module('app').service('userPreferencesService', [
  'localStorageService',
  'VIEW_TYPES',
  (localStorageService, VIEW_TYPES) => {
    const USER_PREFERENCES_KEYS = {
      DEFAULT_VIEW: 'DEFAULT_VIEW'
    };

    class UserPreferencesService {
      /**
       * @return {String}
       */
      getDefaultViewPreference() {
        return localStorageService.get(USER_PREFERENCES_KEYS.DEFAULT_VIEW);
      }

      /**
       * @param {String} viewPreference
       * @return {String}
       */
      setDefaultViewPreference(viewPreference) {
        if (!viewPreference) throw new Error('userPreferencesService - setDefaultViewPreference() - viewPreference is required');
        if (!VIEW_TYPES[viewPreference]) throw new Error(`userPreferencesService - setDefaultViewPreference() - ${viewPreference} is not a valid view type`);

        return localStorageService.set(USER_PREFERENCES_KEYS.DEFAULT_VIEW, viewPreference);
      }
    }

    return new UserPreferencesService();
  }
]);
