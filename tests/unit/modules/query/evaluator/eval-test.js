'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
const _ = require('underscore');
require('sinon-as-promised');

const testUtils = require('tests/utils/testUtils');

var evaluator;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  evaluator = require('lib/modules/query/evaluator');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('connection', function() {
    describe('evaluator', function() {
      describe('eval', function() {
        describe('when no expression is passed', function() {
          it('should return an error', function(next) {
            var expression = null;

            var result = evaluator.eval(expression);

            _.isError(result).should.equal(true);

            result.message.should.equal('evaluator - eval() - must pass an expression');

            return next(null);
          });
        });

        describe('when expression passed is not a string', function() {
          it('should return an error', function(next) {
            var expression = {};

            var result = evaluator.eval(expression);

            _.isError(result).should.equal(true);

            result.message.should.equal('evaluator - eval() - expression must be a string');

            return next(null);
          });
        });

        describe.only('when expression passed is a string', function() {
          describe('simple object expression', function() {
            it('should evaluate the expression and return the result', function(next) {
              var expression = '{ foobar : 1 }';
              var expectedResult = {
                foobar: 1
              };

              var result = evaluator.eval(expression);

              _.isError(result).should.equal(false);

              testUtils.compareObjects(result, expectedResult).should.equal(true);

              return next(null);
            });
          });
        });
      });
    });
  });
});
