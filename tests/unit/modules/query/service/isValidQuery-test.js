'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var queryService;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  queryService = require('lib/modules/query');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('connection', function() {
    describe('query', function() {
      describe('isValidQuery', function() {
        describe('when no query is passed', function() {
          it('should return false', function(next) {
            var rawQuery = null;

            var isValid = queryService.isValidQuery(rawQuery);

            isValid.should.equal(false);

            return next(null);
          });
        });

        describe('when invalid query is passed', function() {
          it('should return false', function(next) {
            var rawQuery = 'fooooobar';

            var isValid = queryService.isValidQuery(rawQuery);

            isValid.should.equal(false);

            return next(null);
          });
        });

        describe('when valid query is passed', function() {
          it('should return true', function(next) {
            var rawQuery = 'db.foobar.foobar';

            var isValid = queryService.isValidQuery(rawQuery);

            isValid.should.equal(true);

            return next(null);
          });
        });
      });
    });
  });
});
