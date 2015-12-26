'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var parser;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  parser = require('lib/modules/query/parser');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('query', function() {
    describe('parser', function() {
      describe('parseCollectionName', function() {
        describe('when no query is passed', function() {
          it('should return null', function(next) {
            var rawQuery = null;

            var collectionName = parser.parseCollectionName(rawQuery);

            should.not.exist(collectionName);

            return next(null);
          });
        });

        describe('when invalid query is passed', function() {
          it('should return null', function(next) {
            var rawQuery = 'fooooobar';

            var collectionName = parser.parseCollectionName(rawQuery);

            should.not.exist(collectionName);

            return next(null);
          });
        });

        describe('when valid query is passed', function() {
          it('should return the collection name portion of the query', function(next) {
            var expectedCollectionName = 'blah';
            var rawQuery = 'db.' + expectedCollectionName + '.foobar({})';

            var collectionName = parser.parseCollectionName(rawQuery);

            should.exist(collectionName);
            collectionName.should.equal(expectedCollectionName);

            return next(null);
          });
        });

        describe('when valid query with underscore is passed', function() {
          it('should return the collection name portion of the query', function(next) {
            var expectedCollectionName = 'blah_blah';
            var rawQuery = 'db.' + expectedCollectionName + '.foobar({})';

            var collectionName = parser.parseCollectionName(rawQuery);

            should.exist(collectionName);
            collectionName.should.equal(expectedCollectionName);

            return next(null);
          });
        });
      });
    });
  });
});
