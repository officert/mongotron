describe('services', function() {
  describe('tabCache', function() {
    describe('list', function() {
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

      describe('when nothing is passed', function() {
        beforeEach(function() {
          tabCache.add({
            type: tabCache.TYPES.QUERY,
            name: 'Tab 1'
          });
          tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 2'
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
