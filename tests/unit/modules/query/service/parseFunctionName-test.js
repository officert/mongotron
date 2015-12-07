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
      describe('parseFunctionName', function() {
        describe('when no query is passed', function() {
          it('should return null', function(next) {
            var rawQuery = null;

            var functionName = queryService.parseFunctionName(rawQuery);

            should.not.exist(functionName);

            return next(null);
          });
        });

        describe('when invalid query is passed', function() {
          it('should return null', function(next) {
            var rawQuery = 'fooooobar';

            var functionName = queryService.parseFunctionName(rawQuery);

            should.not.exist(functionName);

            return next(null);
          });
        });

        describe('when valid query is passed', function() {
          it('should return the collection name portion of the query', function(next) {
            var expectedFunctionName = 'blah';
            var rawQuery = 'db.foobar.' + expectedFunctionName + '({})';

            var functionName = queryService.parseFunctionName(rawQuery);

            should.exist(functionName);
            functionName.should.equal(expectedFunctionName);

            return next(null);
          });
        });
      });
    });
  });
});
