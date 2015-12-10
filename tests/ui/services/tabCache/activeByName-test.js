'use strict';

describe('services', () => {
  describe('tabCache', () => {
    describe('activateByName', () => {
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

      describe('when no name is passed', () => {
        it('should throw an error', () => {
          expect(function() {
            tabCache.activateByName(null);
          }).toThrow(new Error('name is required'));
        });
      });

      describe('when no tab found for the name', () => {
        beforeEach(() => {
          spyOn(tabCache, 'emit');
        });

        it('should do nothing, and not emit and event', () => {
          let name = 'Tab 1';

          tabCache.activateByName(name);

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when tab cache contains for name', () => {
        let tab;
        let name = 'Tab 1';

        beforeEach(() => {
          tab = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: name
          });

          spyOn(tabCache, 'emit');
          spyOn(tabCache, 'deactivateAll').and.stub();
        });

        it('should call tabCache.deactiveAll(), set tab.active to true and emit an event', () => {
          tabCache.activateByName(name);

          expect(tab.active).toEqual(true);
          expect(tabCache.deactivateAll.calls.count()).toEqual(1);
          expect(tabCache.emit.calls.count()).toEqual(1);
        });
      });
    });
  });
});
