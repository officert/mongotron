'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var connectionService;
var connectionRepository;
var sandbox;

before(() => {
  sandbox = sinon.sandbox.create();

  connectionService = require('lib/modules/connection');
  connectionRepository = require('lib/modules/connection/repository');
});

afterEach(() => {
  sandbox.restore();
});

describe('modules', () => {
  describe('connection', () => {
    describe('update', () => {

    });
  });
});
