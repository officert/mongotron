'use strict';

const BaseQuery = require('./baseQuery');

class UpdateOneQuery extends BaseQuery {
  constructor(rawQuery) {
    super(rawQuery);

    this.matchRegex = /^(?:updateOne)\(([^]+)\)/;
    this.extractRegex = /^({[^]+})(?:[\s\n\r])*,(?:[\s\n\r])*({[^]+})/;
    this.mongoMethod = 'updateOne';
  }
}

module.exports = UpdateOneQuery;
