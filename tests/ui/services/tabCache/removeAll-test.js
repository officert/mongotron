describe('services', function() {
  describe('tabCache', function() {
    describe('removeAll', function() {
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

      describe('when no tabs are active', function() {
        beforeEach(function() {
          spyOn(tabCache, 'emit');
        });

        it('should not emit an event', function() {
          tabCache.removeActive();

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when cache contains tabs', function() {
        beforeEach(function() {
          tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });
          tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 2'
          });

          spyOn(tabCache, 'emit');
        });

        it('should remove all tabs and emit an event', function() {
          tabCache.removeAll();

          var tabs = tabCache.list();

          expect(tabs).toBeDefined();
          expect(tabs.length).toEqual(0);
          expect(tabCache.emit.calls.count()).toEqual(1);
        });
      });
    });
  });
});
