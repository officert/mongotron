describe('services', function() {
  describe('tabCache', function() {
    describe('list', function() {
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

      describe('when nothing is passed', function() {
        beforeEach(function() {
          tabCache.add({
            type: tabCache.TYPES.QUERY
          });
          tabCache.add({
            type: tabCache.TYPES.PAGE
          });
        });

        it('should return tabs', function() {
          var tabs = tabCache.list();

          expect(tabs).toBeDefined();
          expect(tabs.length).toEqual(2);
        });
      });
    });
  });
});
