describe('services', function() {
  describe('tabCache', function() {
    describe('activateById', function() {
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

      describe('when no id is passed', function() {
        it('should throw an error', function() {
          expect(function() {
            tabCache.activateById(null);
          }).toThrow(new Error('id is required'));
        });
      });

      describe('when tab does not exist for id', function() {
        beforeEach(function() {
          spyOn(tabCache, 'emit');
        });

        it('should return and not emit an event', function() {
          tabCache.activateById('123');

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when tab does exist for id', function() {
        var tab1;

        beforeEach(function() {
          tab1 = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });

          spyOn(tabCache, 'emit');
          spyOn(tabCache, 'deactivateAll').and.stub();
        });

        it('should call tabCache.deactivateAll() and activate the tab and emit an event', function() {
          tabCache.activateById(tab1.id);

          expect(tabCache.deactivateAll.calls.count()).toEqual(1);
          expect(tabCache.emit.calls.count()).toEqual(1);

          expect(tab1.active).toEqual(true);
        });
      });

    });
  });
});
