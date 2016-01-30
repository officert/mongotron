'use strict';

require('tests/unit/before-all');

const should = require('should');

let expression;

before(() => {
  expression = require('lib/modules/expression');
});

describe('modules', () => {
  describe('expression', () => {
    describe('getMongoCollectionName', () => {
      describe('when an expression is not passed', () => {
        let expr = null;

        it('should return null', () => {
          let value = expression.getMongoCollectionName(expr);
          should(value).equal(null);
        });
      });

      describe('when an invalid expression is not passed', () => {
        let expr = 'aasdfasdf.asd.as.dfas.';

        it('should return null', () => {
          let value = expression.getMongoCollectionName(expr);
          should(value).equal(null);
        });
      });

      describe('when an expression is passed and doesn\'t begin with db Identifier', () => {
        let expr = 'foooobar';

        it('should return null', () => {
          let value = expression.getMongoCollectionName(expr);
          should(value).equal(null);
        });
      });

      describe('when an expression is passed and begins with db Identifier but has no collection name', () => {
        let expr = 'db.';

        it('should return null', () => {
          let value = expression.getMongoCollectionName(expr);
          should(value).equal(null);
        });
      });

      describe('when an expression is passed and begins with db Identifier and has a collection name in dot notation', () => {
        let expr = 'db.Cars';

        it('should return the collection name', () => {
          let value = expression.getMongoCollectionName(expr);
          should(value).equal('Cars');
        });
      });

      describe('when an expression is passed and begins with db Identifier and has a collection name in bracket notation', () => {
        let expr = `db['Cars']`;

        it('should return the collection name', () => {
          let value = expression.getMongoCollectionName(expr);
          should(value).equal('Cars');
        });
      });
    });
  });
});
