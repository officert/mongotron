'use strict';

require('tests/unit/before-all');

const should = require('should');

let expression;

before(() => {
  expression = require('lib/modules/expression');
});

describe('modules', () => {
  describe('expression', () => {
    describe('getMongoMethodName', () => {
      describe('when an expression is not passed', () => {
        let expr = null;

        it('should return null', () => {
          let value = expression.getMongoMethodName(expr);
          should(value).equal(null);
        });
      });
    });
  });
});
