'use strict';

const BaseQuery = require('./baseQuery');

class UpdateManyQuery extends BaseQuery {
  constructor() {
    super();

    this.extractOptions = true;
    this.mongoMethod = 'updateMany';
  }
}

module.exports = UpdateManyQuery;
