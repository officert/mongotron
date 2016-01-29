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
          expression.eval(expr)
            .catch(error => {

              should.exist(error);

              error.message.should.equal('Expression - eval() - expression is required');

              return next(null);
            });
        });
      });

      describe('when an collections is not passed', () => {
        let expr = 'asdfasdf';
        let collections = null;

        it('should reject with an error', next => {
          expression.eval(expr, collections)
            .catch(error => {

              should.exist(error);

              error.message.should.equal('Expression - eval() - collections is required');

              return next(null);
            });
        });
      });

      describe('when an collections passed is not an array', () => {
        let expr = 'asdfasdf';
        let collections = 'asdfasdf';

        it('should reject with an error', next => {
          expression.eval(expr, collections)
            .catch(error => {

              should.exist(error);

              error.message.should.equal('Expression - eval() - collections is required');

              return next(null);
            });
        });
      });
    });
  });
});
