'use strict';

const BaseQuery = require('./baseQuery');

class DeleteManyQuery extends BaseQuery {
  constructor(rawQuery) {
    super(rawQuery);

    this.matchRegex = /^(?:deleteMany)\(([^]+)\)/;
    this.extractRegex = /^(?:deleteMany)\(([^]+)\)/;
    this.mongoMethod = 'deleteMany';
  }
}

module.exports = DeleteManyQuery;
