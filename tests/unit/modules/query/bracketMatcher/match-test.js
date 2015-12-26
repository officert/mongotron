'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var bracketMatcher;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  bracketMatcher = require('lib/modules/query/bracketMatcher');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('query', function() {
    describe('bracketMatcher', function() {
      describe('match', function() {
        describe('when no string is passed', function() {
          it('should return null', function(next) {
            var str = null;

            var parts = bracketMatcher.match(str);

            should(parts).equal(null);

            return next(null);
          });
        });

        describe('when string contains only an opening bracket', function() {
          it('should return an array containing the full string', function(next) {
            var str = '{ foo : "bar"';

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(1);
            should(parts[0]).equal(str);

            return next(null);
          });
        });

        describe('when string contains a single object with a single property', function() {
          it('should return an array with 1 value equal to the string', function(next) {
            var str = '{ foo : "bar" }';

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(1);
            should(parts[0]).equal(str);

            return next(null);
          });
        });

        describe('when string contains a single object with multiple properties', function() {
          it('should return an array with 1 value equal to the string', function(next) {
            var str = '{ foo : "bar", bar : "foo" }';

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(1);
            should(parts[0]).equal(str);

            return next(null);
          });
        });

        describe('when string contains a single object with a nested object', function() {
          it('should return an array with 1 value equal to the string', function(next) {
            var str = '{ person : { name : "John Doe" } }';

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(1);
            should(parts[0]).equal(str);

            return next(null);
          });
        });

        describe('when string contains a single object with a nested array', function() {
          it('should return an array with 1 value equal to the string', function(next) {
            var str = '{ person : { dogs : ["Larry", "Barry", "Harry"] } }';

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(1);
            should(parts[0]).equal(str);

            return next(null);
          });
        });

        describe('when string contains a single object with a nested array containing objects', function() {
          it('should return an array with 1 value equal to the string', function(next) {
            var str = '{ person : { dogs : [{ name : "Larry" }, { name : "Harry" }] } }';

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(1);
            should(parts[0]).equal(str);

            return next(null);
          });
        });

        describe('when string contains 2 objects', function() {
          it('should return an array with 2 values equal to the first and second object', function(next) {
            var str1 = '{ person : { name : "John Doe" } }';
            var str2 = '{ $set : { name : "Foobar" } }';
            var str = str1 + ',' + str2;

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(2);
            should(parts[0]).equal(str1);
            should(parts[1]).equal(str2);

            return next(null);
          });
        });

        describe('when string contains 2 objects each with nested objects', function() {
          it('should return an array with 2 values equal to the first and second object', function(next) {
            var str1 = '{ person : { name : "John Doe", address : { street : "Foobar Lane", city : "Ardvark" } } }';
            var str2 = '{ $set : { name : "Foobar", address: { city : "Banana" } } }';
            var str = str1 + ',' + str2;

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(2);
            should(parts[0]).equal(str1);
            should(parts[1]).equal(str2);

            return next(null);
          });
        });

        describe('when string contains 3 objects', function() {
          it('should return an array with 3 values equal to the first, second and third objects', function(next) {
            var str1 = '{ person : { name : "John Doe" } }';
            var str2 = '{ $set : { name : "Foobar" } }';
            var str3 = '{ $set : { name : "Barfoo" } }';
            var str = str1 + ',' + str2 + ',' + str3;

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(3);
            should(parts[0]).equal(str1);
            should(parts[1]).equal(str2);
            should(parts[2]).equal(str3);

            return next(null);
          });
        });

        describe('when string contains 4 objects', function() {
          it('should return an array with 4 values equal to the first, second, third and fourth objects', function(next) {
            var str1 = '{ person : { name : "John Doe" } }';
            var str2 = '{ $set : { name : "Foobar" } }';
            var str3 = '{ $set : { name : "Barfoo" } }';
            var str4 = '{ $set : { banana : "Jamama" } }';
            var str = str1 + ',' + str2 + ',' + str3 + ',' + str4;

            var parts = bracketMatcher.match(str);

            should.exist(parts);
            should(parts.length).equal(4);
            should(parts[0]).equal(str1);
            should(parts[1]).equal(str2);
            should(parts[2]).equal(str3);
            should(parts[3]).equal(str4);

            return next(null);
          });
        });
      });
    });
  });
});
