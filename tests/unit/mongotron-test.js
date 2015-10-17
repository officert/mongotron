// 'use strict';
//
// require('tests/unit/before-all');
//
// const should = require('should');
// const sinon = require('sinon');
// const Promise = require('bluebird');
//
// var mongotron;
// var connectionService;
// var sandbox;
//
// before(function() {
//   sandbox = sinon.sandbox.create();
//
//   mongotron = require('src/mongotron');
//   connectionService = require('lib/connectionService');
// });
//
// afterEach(function() {
//   sandbox.restore();
// });
//
// describe('mongotron', function() {
//   describe('init', function() {
//     var initializeConnectionsStub;
//
//     before(function() {
//       initializeConnectionsStub = sandbox.stub(connectionService, 'initializeConnections', function() {
//         return new Promise(function(resolve) {
//           return resolve();
//         });
//       });
//     });
//
//     it('should call connectionService.initializeConnections()', function(next) {
//       mongotron.init()
//         .then(function() {
//           should(initializeConnectionsStub.calledOnce).equal(true);
//           return next(null);
//         })
//         .catch(function(err) {
//           return next(err);
//         });
//     });
//   });
// });
