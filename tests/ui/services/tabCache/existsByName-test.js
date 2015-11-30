describe('services', function() {
  describe('tabCache', function() {
    describe('existsByName', function() {
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

      describe('when no name is passed', function() {
        var name = null;

        it('should throw an error', function() {
          expect(function() {
            tabCache.existsByName(name);
          }).toThrow(new Error('name is required'));
        });
      });

      describe('when tab does not exist for name', function() {
        it('should return false', function() {
          var exists = tabCache.existsByName('foobar');

          expect(exists).toEqual(false);
        });
      });

      describe('when tab does exist for name', function() {
        var tabName = 'Tab 1';
        var tab;

        beforeEach(function() {
          tab = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: tabName
          });
        });

        it('should return true', function() {
          var exists = tabCache.existsByName(tabName);

          expect(exists).toEqual(true);
        });
      });
    });
  });
});
