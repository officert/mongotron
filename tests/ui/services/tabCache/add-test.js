describe('services', function() {
  describe('tabCache', function() {
    describe('add', function() {
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
            tabCache.add(tab);
          }).toThrow(new Error('tab is required'));
        });
      });

      describe('when no tab name is passed', function() {
        var tab = {
          name: null
        };

        it('should throw an error', function() {
          expect(function() {
            tabCache.add(tab);
          }).toThrow(new Error('tab.name is required'));
        });
      });

      describe('when tab type is invalid', function() {
        var invalidType = 'FOOBAR';
        var tab;

        beforeEach(function() {
          tab = {
            name: 'Tab 1',
            type: invalidType
          };
        });

        it('should throw an error', function() {
          expect(function() {
            tabCache.add(tab);
          }).toThrow(new Error(invalidType + ' is not a valid tab type'));
        });
      });

      describe('when tab type is PAGE', function() {
        var iconClassName = 'fa fa-file-code-o';
        var tab;

        beforeEach(function() {
          tab = {
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          };
        });

        it('should set iconClassName to \'fa fa-file-code-o\'', function() {
          var newTab = tabCache.add(tab);

          expect(newTab).toBeDefined();
          expect(newTab.iconClassName).toBe(iconClassName);
        });
      });

      describe('when tab type is QUERY', function() {
        var iconClassName = '';
        var tab;

        beforeEach(function() {
          tab = {
            type: tabCache.TYPES.QUERY,
            name: 'Tab 1'
          };
        });

        it('should set iconClassName to an empty string', function() {
          var newTab = tabCache.add(tab);

          expect(newTab).toBeDefined();
          expect(newTab.iconClassName).toBe(iconClassName);
        });
      });

      describe('when tab is added', function() {
        var tab1;

        beforeEach(function() {
          tab1 = tabCache.add({
            type: tabCache.TYPES.QUERY,
            name: 'Tab 1'
          });
          tabCache.activateById(tab1.id);

          spyOn(tabCache, 'emit');
        });

        it('should deactivate any other tabs and emit 2 events', function() {
          var newTab = tabCache.add({
            type: tabCache.TYPES.QUERY,
            name: 'Tab 1'
          });

          newTab = tabCache.getById(newTab.id);

          expect(tab1.active).toBe(false);
          expect(newTab.active).toBe(true);
          expect(tabCache.emit.calls.count()).toEqual(2);
        });
      });
    });
  });
});
