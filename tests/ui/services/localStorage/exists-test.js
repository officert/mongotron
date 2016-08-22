'use strict';

describe('localStorageService', () => {
  describe('exists', () => {
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
          localStorageService.exists(key);
        }).toThrow(new Error('localStorageService - exists() - key is required'));
      });
    });
  });
});
