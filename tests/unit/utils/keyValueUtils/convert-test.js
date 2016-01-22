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
    describe('convert', function() {
      describe('when null value is passed', () => {
        it('should return null', function(next) {
          var value = null;

          var result = keyValueUtils.convert(value);

          should(result).equal(null);

          return next(null);
        });
      });

      describe('when undefined value is passed', () => {
        it('should return null', function(next) {
          var value;

          var result = keyValueUtils.convert(value);

          should(result).equal(null);

          return next(null);
        });
      });

      // describe('when value is a string', () => {
      //   it('should return an object', function(next) {
      //     var value = 'Hello';
      //
      //     var result = keyValueUtils.convert(value);
      //
      //     should.exist(result);
      //     result.value.should.equal(value);
      //
      //     return next(null);
      //   });
      // });

      describe('when value is an object that contains only string properties', () => {
        it('should return an object', function(next) {
          var value = {
            key1: 'value1',
            key2: 'value2'
          };

          var result = keyValueUtils.convert(value);

          should.exist(result);
          should(result.original).equal(value);
          should.exist(result.keyValues);

          result.keyValues.length.should.equal(_.keys(value).length);

          result.keyValues[0].key.should.equal('key1');
          result.keyValues[0].value.should.equal(value.key1);
          result.keyValues[0].type.should.equal('string');
          result.keyValues[0].icon.should.equal(keyValueUtils.getPropertyTypeIcon('string'));

          result.keyValues[1].key.should.equal('key2');
          result.keyValues[1].value.should.equal(value.key2);
          result.keyValues[1].type.should.equal('string');
          result.keyValues[1].icon.should.equal(keyValueUtils.getPropertyTypeIcon('string'));

          return next(null);
        });
      });

      describe('when value is an object that contains a nested object property', () => {
        it('should return an object', function(next) {
          var value = {
            key1: {
              'key1-1': 'value1-1',
              'key1-2': 'value1-2'
            },
            key2: ['1', '2']
          };

          var result = keyValueUtils.convert(value);

          should.exist(result);
          should(result.original).equal(value);
          should.exist(result.keyValues);

          result.keyValues.length.should.equal(_.keys(value).length);

          result.keyValues[0].key.should.equal('key1');

          return next(null);
        });
      });
    });
  });
});
