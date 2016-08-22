'use strict';

describe('localStorageService', () => {
  describe('get', () => {
    describe('when no key is passed', () => {
      let localStorageService;
      let key = null;

      beforeEach(() => {
        angular.mock.module('app');

        inject([
          'localStorageService', (_localStorageService) => {
            localStorageService = _localStorageService;
          }
        ]);
      });

      it('should throw an error', () => {
        expect(() => {
          localStorageService.get(key);
        }).toThrow(new Error('localStorageService - get() - key is required'));
      });
    });
  });
});
