'use strict';

describe('localStorageService', () => {
  describe('set', () => {
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
          localStorageService.set(key);
        }).toThrow(new Error('localStorageService - set() - key is required'));
      });
    });
  });
});
