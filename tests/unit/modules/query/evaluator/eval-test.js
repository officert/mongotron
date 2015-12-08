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
  describe('query', function() {
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

        describe('when expression passed is a string', function() {
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

          describe('simple object expression with date', function() {
            it('should evaluate the expression and return the result', function(next) {
              var expression = '{ foobar1 : 1, foobar2: 2, foobar3: 3, date : new Date(2015, 1) }';
              var expectedResult = {
                foobar1: 1,
                foobar2: 2,
                foobar3: 3,
                date: new Date(2015, 1)
              };

              var result = evaluator.eval(expression);

              _.isError(result).should.equal(false);

              testUtils.compareObjects(result, expectedResult).should.equal(true);

              return next(null);
            });
          });

          describe('expression that attempts to use a function that is not in scope', function() {
            it('should return an error', function(next) {
              var expression = '{ foobar : someFunction() }';
              var scope = {};

              var result = evaluator.eval(expression, scope);

              _.isError(result).should.equal(true);

              result.message.should.equal('someFunction is not defined');

              return next(null);
            });
          });

          describe('expression that attempts to use a function that is in scope', function() {
            it('should evaluate the expression and return the result', function(next) {
              var expression = '{ foobar : someFunction() }';
              var scope = {
                someFunction: function() {
                  return 'Hello';
                }
              };
              var expectedResult = {
                foobar: scope.someFunction()
              };

              var result = evaluator.eval(expression, scope);

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
