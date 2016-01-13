describe('services', () => {
  describe('tabCache', () => {
    describe('activateNext', () => {
      var tabCache;

      beforeEach(() => {
        module('app');

        inject([
          'tabCache', (_tabCache) => {
            tabCache = _tabCache;
          }
        ]);
      });

      describe('when tab cache contains no tabs', () => {
        beforeEach(() => {
          spyOn(tabCache, 'emit');
        });

        it('should do nothing, and not emit and event', () => {
          tabCache.activateNext();

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when tab cache contains 1 tab', () => {
        beforeEach(() => {
          tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });

          spyOn(tabCache, 'emit');
        });

        it('should do nothing, and not emit and event', () => {
          tabCache.activateNext();

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when there is no active tab', () => {
        beforeEach(() => {
          tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });
          tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 2'
          });

          tabCache.deactivateAll();

          spyOn(tabCache, 'emit');
        });

        it('should do nothing, and not emit and event', () => {
          tabCache.activateNext();

          expect(tabCache.emit.calls.count()).toEqual(0);
        });
      });

      describe('when there is an active tab', () => {
        beforeEach(() => {
          var tab1 = tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 1'
          });

          tabCache.add({
            type: tabCache.TYPES.PAGE,
            name: 'Tab 2'
          });

          tabCache.activateById(tab1.id);

          spyOn(tabCache, 'emit');
        });

        it('should activate the tab and emit and event', () => {
          tabCache.activateNext();

          var tabs = tabCache.list();

          var tab1 = _.findWhere(tabs, {
            name: 'Tab 1'
          });
          var tab2 = _.findWhere(tabs, {
            name: 'Tab 2'
          });

          expect(tab1).toBeDefined();
          expect(tab2).toBeDefined();
          expect(tab1.active).toEqual(false);
          expect(tab2.active).toEqual(true);
          expect(tabCache.emit.calls.count()).toEqual(1);
        });
      });
    });
  });
});
