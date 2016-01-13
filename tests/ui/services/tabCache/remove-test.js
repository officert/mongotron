describe('services', function() {
  describe('tabCache', function() {
    describe('remove', function() {
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

      describe('when no tab is passed', function() {
        var tab = null;

        it('should throw an error', function() {
          expect(function() {
            tabCache.remove(tab);
          }).toThrow(new Error('tab is required'));
        });
      });

      describe('when tab is not in cache', function() {
        beforeEach(function() {
          spyOn(tabCache, 'emit');
        });

        it('should do nothing and not emit an event', function() {
          tabCache.remove({

          });

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when tab is in cache', function() {
        var tab;

        beforeEach(function() {
          tab = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });

          spyOn(tabCache, 'emit');
        });

        it('should remove the tab and emit an event', function() {
          tabCache.remove(tab);

          var foundTab = tabCache.getById(tab.id);

          expect(foundTab).toBeUndefined();

          expect(tabCache.emit.calls.count()).toEqual(1);
        });
      });
    });
  });
});
