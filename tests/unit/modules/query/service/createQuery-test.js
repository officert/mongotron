'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
const _ = require('underscore');

const testUtils = require('tests/utils/testUtils');

require('sinon-as-promised');

var queryService;
var queryClass;
var sandbox;
var mongodb = require('mongodb');

before(function() {
  sandbox = sinon.sandbox.create();

  queryClass = require('lib/modules/query/query');
  queryService = require('lib/modules/query');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('query', function() {
    describe('service', function() {
      describe('createQuery', function() {
        describe('when no query is passed', function() {
          it('should reject with an error', function(next) {
            var rawQuery = null;

            queryService.createQuery(rawQuery)
              .catch((error) => {
                should.exist(error);
                should(_.isError(error)).equal(true);
                error.message.should.equal('Query - parse() : rawQuery is required');
                next();
              });
          });
        });

        describe('when invalid query is passed', function() {
          it('should reject with an error', function(next) {
            var rawQuery = 'fooooobar';

            queryService.createQuery(rawQuery)
              .catch((error) => {
                should.exist(error);
                should(_.isError(error)).equal(true);
                error.message.should.equal('Invalid query');
                next();
              });
          });
        });

        describe('when query contains an unsupported function name', function() {
          it('should reject with an error', function(next) {
            var rawQuery = 'db.foobar.badFunction()';

            queryService.createQuery(rawQuery)
              .catch((error) => {
                should.exist(error);
                should(_.isError(error)).equal(true);
                error.message.should.equal('badFunction is not a supported query');
                next();
              });
          });
        });

        describe('when no options are passed to an update query', function() {
          it('should reject with an error', function(next) {
            var rawQuery = 'db.foobar.updateOne()';

            queryService.createQuery(rawQuery)
              .catch((error) => {
                should.exist(error);
                should(_.isError(error)).equal(true);
                console.log(error);
                error.message.should.equal('query options are required for mongo updateOne');
                next();
              });
          });
        });

        describe('when no options are passed to an updateMany query', function() {
          it('should reject with an error', function(next) {
            var rawQuery = 'db.foobar.updateMany()';

            queryService.createQuery(rawQuery)
              .catch((error) => {
                should.exist(error);
                should(_.isError(error)).equal(true);
                console.log(error);
                error.message.should.equal('query options are required for mongo updateMany');
                next();
              });
          });
        });

        describe('when valid query is passed', function() {
          describe('find query', function() {
            describe('empty query', function() {
              it('should resolve Query Class Object', function(next) {
                var rawQuery = 'db.foobar.find({})';
                var expectedQuery = {
                  rawQuery: rawQuery,
                  mongoMethod: 'find',
                  extractOptions: false,
                  query: {},
                  queryOptions: null
                };

                queryService.createQuery(rawQuery)
                  .then((query) => {
                    should.exist(query);
                    query.should.be.an.instanceOf(queryClass);
                    query.should.have.property('rawQuery', expectedQuery.rawQuery);
                    query.should.have.property('mongoMethod', expectedQuery.mongoMethod);
                    query.should.have.property('extractOptions', expectedQuery.extractOptions);
                    query.should.have.property('queryOptions', expectedQuery.queryOptions);
                    query.should.have.property('query', query.query);
                    next();
                  })
                  .catch((reason) => {
                    should.not.exist(reason);
                    next();
                  });
              });
            });

            describe('query containing ObjectId', function() {
              it('should properly parse ObjectId', function(next) {
                var rawQuery = 'db.foobar.find({ _id: ObjectId("559d3e5b8152eefd4e9bed45") })';
                var expectedQuery = {
                  rawQuery: rawQuery,
                  mongoMethod: 'find',
                  extractOptions: false,
                  query: {
                    _id: mongodb.ObjectId("559d3e5b8152eefd4e9bed45")
                  },
                  queryOptions: null
                };

                queryService.createQuery(rawQuery)
                  .then((query) => {
                    should.exist(query);
                    query.should.be.an.instanceOf(queryClass);
                    query.should.have.property('rawQuery', expectedQuery.rawQuery);
                    query.should.have.property('mongoMethod', expectedQuery.mongoMethod);
                    query.should.have.property('extractOptions', expectedQuery.extractOptions);
                    query.should.have.property('queryOptions', expectedQuery.queryOptions);
                    query.should.have.property('query');
                    testUtils.compareMongoObjectIds(expectedQuery.query._id, query.query._id).should.equal(true);
                    next();
                  })
                  .catch((reason) => {
                    should.not.exist(reason);
                    next();
                  });
              });
            });
          });

          describe('aggregate query', function() {
            describe('empty query', function() {
              it('should resolve Query Class Object', function(next) {
                var rawQuery = 'db.foobar.aggregate({})';
                var expectedQuery = {
                  rawQuery: rawQuery,
                  mongoMethod: 'aggregate',
                  extractOptions: false,
                  query: {},
                  queryOptions: null
                };

                queryService.createQuery(rawQuery)
                  .then((query) => {
                    should.exist(query);
                    query.should.be.an.instanceOf(queryClass);
                    query.should.have.property('rawQuery', expectedQuery.rawQuery);
                    query.should.have.property('mongoMethod', expectedQuery.mongoMethod);
                    query.should.have.property('extractOptions', expectedQuery.extractOptions);
                    query.should.have.property('queryOptions', expectedQuery.queryOptions);
                    query.should.have.property('query', query.query);
                    next();
                  })
                  .catch((reason) => {
                    should.not.exist(reason);
                    next();
                  });
              });
            });
          });

          describe('count query', function() {
            describe('empty query', function() {
              it('should resolve Query Class Object', function(next) {
                var rawQuery = 'db.foobar.count({})';
                var expectedQuery = {
                  rawQuery: rawQuery,
                  mongoMethod: 'count',
                  extractOptions: false,
                  query: {},
                  queryOptions: null
                };

                queryService.createQuery(rawQuery)
                  .then((query) => {
                    should.exist(query);
                    query.should.be.an.instanceOf(queryClass);
                    query.should.have.property('rawQuery', expectedQuery.rawQuery);
                    query.should.have.property('mongoMethod', expectedQuery.mongoMethod);
                    query.should.have.property('extractOptions', expectedQuery.extractOptions);
                    query.should.have.property('queryOptions', expectedQuery.queryOptions);
                    query.should.have.property('query', query.query);
                    next();
                  })
                  .catch((reason) => {
                    should.not.exist(reason);
                    next();
                  });
              });
            });
          });

          describe('updateMany query', function() {
            describe('empty query', function() {
              it('should resolve Query Class Object', function(next) {
                var rawQuery = 'db.foobar.updateMany({},{})';
                var expectedQuery = {
                  rawQuery: rawQuery,
                  mongoMethod: 'updateMany',
                  extractOptions: true,
                  query: {},
                  queryOptions: {}
                };

                queryService.createQuery(rawQuery)
                  .then((query) => {
                    should.exist(query);
                    query.should.be.an.instanceOf(queryClass);
                    query.should.have.property('rawQuery', expectedQuery.rawQuery);
                    query.should.have.property('mongoMethod', expectedQuery.mongoMethod);
                    query.should.have.property('extractOptions', expectedQuery.extractOptions);
                    query.should.have.property('queryOptions', expectedQuery.queryOptions);
                    query.should.have.property('query', query.query);
                    next();
                  })
                  .catch((error) => {
                    console.log(error);
                    should.not.exist(error);
                    next();
                  });
              });
            });
          });
        });
      });
    });
  });
});
