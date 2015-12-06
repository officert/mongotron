'use strict';

const BaseQuery = require('./baseQuery');

class UpdateManyQuery extends BaseQuery {
  constructor(rawQuery) {
    super(rawQuery);

    this.matchRegex = /^(?:updateMany)\(([^]+)\)/;
    this.extractRegex = /^({[^]+})(?:[\s\n\r])*,(?:[\s\n\r])*({[^]+})/;
    this.mongoMethod = 'updateMany';
  }
}

module.exports = UpdateManyQuery;
