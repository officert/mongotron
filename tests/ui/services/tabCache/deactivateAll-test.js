'use strict';

describe('services', () => {
  describe('tabCache', () => {
    describe('deactivateAll', () => {
      /* ------------------------------------------------------------
       * Test Suite Setup
       * ------------------------------------------------------------ */
      var tabCache;

      beforeEach(() => {
        module('app');

        inject([
          'tabCache', (_tabCache) => {
            tabCache = _tabCache;
          }
        ]);
      });

      /* ------------------------------------------------------------
       * Tests
       * ------------------------------------------------------------ */

      describe('when tab cache does not contain tabs', () => {
        beforeEach(() => {
          spyOn(tabCache, 'emit');
        });

        it('should do nothing, and not emit an event', () => {
          tabCache.deactivateAll();

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when tab cache contains tabs', () => {
        let tab1;
        let tab2;

        beforeEach(() => {
          tab1 = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });

          tab2 = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 2'
          });

          spyOn(tabCache, 'emit');
        });

        it('should set tab.active to true and emit an event', () => {
          tabCache.deactivateAll();

          expect(tab1.active).toEqual(false);
          expect(tab2.active).toEqual(false);
          expect(tabCache.emit.calls.count()).toEqual(1);
        });
      });
    });
  });
});
