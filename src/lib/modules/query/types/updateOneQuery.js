'use strict';

const BaseQuery = require('./baseQuery');

class UpdateOneQuery extends BaseQuery {
  constructor() {
    super();

    this.extractOptions = true;
    this.mongoMethod = 'updateOne';
  }
}

module.exports = UpdateOneQuery;
