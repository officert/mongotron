'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

let expression;
let sandbox;

before(() => {
  sandbox = sinon.sandbox.create();

  expression = require('lib/modules/expression');
});

afterEach(() => {
  sandbox.restore();
});

describe('modules', () => {
  describe('expression', () => {
    describe('eval', () => {
      describe('when an expression is not passed', () => {
        let expr = null;

        it('should reject with an error', next => {
          expression.evaluate(expr)
            .catch(error => {

              should.exist(error);

              error.message.should.equal('Expression - eval() - expression is required');

              return next(null);
            });
        });
      });

      describe('when evaluating a simple expression', () => {
        let expr = '1 + 2';
        let expectedEvalResult = 3;

        it('should return an expression result object', next => {
          expression.evaluate(expr)
            .then(expressionResult => {

              should.exist(expressionResult);

              expressionResult.result.should.equal(expectedEvalResult);

              return next(null);
            });
        });
      });

      describe('when evaluating an expression containing a variable', () => {
        let expr = 'var foo = "hello"; foo';
        let expectedEvalResult = 'hello';

        it('should return an expression result object', next => {
          expression.evaluate(expr)
            .then(expressionResult => {

              should.exist(expressionResult);

              expressionResult.result.should.equal(expectedEvalResult);

              return next(null);
            });
        });
      });

      describe('when evaluating an expression containing something not in scope', () => {
        let expr = 'foo';
        let expectedEvalResult = 'foo is not defined';

        it('should reject with an error', next => {
          expression.evaluate(expr)
            .catch(error => {

              should.exist(error);
              error.message.should.equal(expectedEvalResult);

              return next(null);
            });
        });
      });

      describe('when evaluating an expression containing variable that is in scope', () => {
        let expr = 'foo';
        let evalScope = {
          foo: 12345
        };
        let expectedEvalResult = 12345;

        it('should return an expression result object', next => {
          expression.evaluate(expr, evalScope)
            .then(expressionResult => {

              should.exist(expressionResult);
              expressionResult.result.should.equal(expectedEvalResult);

              return next(null);
            });
        });
      });

      describe('when evaluating an expression containing a function that is in scope', () => {
        let expr = 'foo()';
        let evalScope = {
          foo: function() {
            return 12345;
          }
        };
        let expectedEvalResult = 12345;

        it('should return an expression result object', next => {
          expression.evaluate(expr, evalScope)
            .then(expressionResult => {

              should.exist(expressionResult);
              expressionResult.result.should.equal(expectedEvalResult);

              return next(null);
            });
        });
      });
    });
  });
});
