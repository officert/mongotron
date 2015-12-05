describe('services', function() {
  describe('tabCache', function() {
    describe('removeActive', function() {
      /* ------------------------------------------------------------
       * Test Suite Setup
       * ------------------------------------------------------------ */
      var tabCache;

      beforeEach(function() {
        module('app');

        inject([
          'tabCache',
          function(_tabCache) {
            tabCache = _tabCache;
          }
        ]);
      });

      /* ------------------------------------------------------------
       * Tests
       * ------------------------------------------------------------ */

      describe('when no tabs are active', function() {
        beforeEach(function() {
          spyOn(tabCache, 'emit');
        });

        it('should not emit an event', function() {
          tabCache.removeActive();

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when a tab is active', function() {
        beforeEach(function() {
          var tab1 = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });

          tabCache.activateById(tab1.id);

          spyOn(tabCache, 'emit');
          spyOn(tabCache, 'remove').and.stub();
        });

        it('should call tabCache.remove() and emit an event', function() {
          tabCache.removeActive();

          expect(tabCache.remove.calls.count()).toEqual(1);
          expect(tabCache.emit.calls.count()).toEqual(1);
        });
      });
    });
  });
});
