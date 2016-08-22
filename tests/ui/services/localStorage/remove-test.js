'use strict';

describe('localStorageService', () => {
  describe('remove', () => {
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
          localStorageService.remove(key);
        }).toThrow(new Error('localStorageService - remove() - key is required'));
      });
    });
  });
});
