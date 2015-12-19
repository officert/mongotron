'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
const _ = require('underscore');
require('sinon-as-promised');

var keyValueUtils;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  keyValueUtils = require('lib/utils/keyValueUtils');
});

afterEach(function() {
  sandbox.restore();
});

describe('utils', function() {
  describe('keyValueUtils', function() {
    describe.only('convert', function() {
      describe('when null value is passed', () => {
        it('should return null', function(next) {
          var value = null;

          var result = keyValueUtils.convert(value);

          should(result).equal(null);

          return next(null);
        });
      });

      describe('when value is an object', () => {
        // it('should return null', function(next) {
        //   var value = null;
        //
        //   var result = keyValueUtils.convert(value);
        //
        //   should(result).equal(null);
        //
        //   return next(null);
        // });
      });
    });
  });
});
