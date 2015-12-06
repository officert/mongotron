'use strict';

const BaseQuery = require('./baseQuery');

class DeleteOneQuery extends BaseQuery {
  constructor(rawQuery) {
    super(rawQuery);

    this.matchRegex = /^(?:deleteOne)\(([^]+)\)/;
    this.extractRegex = /^(?:deleteOne)\(([^]+)\)/;
    this.mongoMethod = 'deleteOne';
  }
}

module.exports = DeleteOneQuery;
