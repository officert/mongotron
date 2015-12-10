'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
const _ = require('underscore');
require('sinon-as-promised');

var Query;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  Query = require('lib/modules/query/query');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('query', function() {
    describe('query', function() {
      describe('parse', function() {
        describe('when no query is passed', function() {
          it('should return an error', function(next) {
            var rawQuery = null;

            var query = new Query();

            query.parse(rawQuery)
              .catch(function(error) {
                should.exist(error);

                should(_.isError(error)).equal(true);

                return next(null);
              });
          });
        });
      });
    });
  });
});
