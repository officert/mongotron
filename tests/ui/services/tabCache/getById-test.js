describe('services', function() {
  describe('tabCache', function() {
    describe('getById', function() {
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

      describe('when no id is passed', function() {
        var id = null;

        it('should throw an error', function() {
          expect(function() {
            tabCache.getById(id);
          }).toThrow(new Error('id is required'));
        });
      });

      describe('when id is passed', function() {
        var tab;

        beforeEach(function() {
          tab = tabCache.add({
            type: tabCache.TYPES.QUERY,
            name: 'Tab 1'
          });
        });

        it('should return the tab', function() {
          var foundTab = tabCache.getById(tab.id);

          expect(foundTab).toBeDefined();
        });
      });
    });
  });
});
