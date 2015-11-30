describe('services', function() {
  describe('tabCache', function() {
    describe('exists', function() {
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

      describe('when no tab is passed', function() {
        var tab = null;

        it('should throw an error', function() {
          expect(function() {
            tabCache.exists(tab);
          }).toThrow(new Error('tab is required'));
        });
      });

      describe('when object that is not in cache is passed', function() {
        it('should return false', function() {
          var exists = tabCache.exists({});

          expect(exists).toEqual(false);
        });
      });

      describe('when tab that is in cache is passed', function() {
        var tab;

        beforeEach(function() {
          tab = tabCache.add({
            type: tabCache.TYPES.PAGE
          });
        });

        it('should return true', function() {
          var exists = tabCache.exists(tab);

          expect(exists).toEqual(true);
        });
      });
    });
  });
});
