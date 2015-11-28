describe('services', function() {
  describe('tabCache', function() {

    /* ------------------------------------------------------------
     * Test Suite Setup
     * ------------------------------------------------------------ */

    beforeEach(function() {
      module('app');

      inject([
        function() {}
      ]);
    });

    /* ------------------------------------------------------------
     * Tests
     * ------------------------------------------------------------ */

    describe('when 1', function() {
      // var scope;

      it('should equal 1', function(done) {

        expect(1).toEqual(1);

        done();
      });
    });
  });
});
