'use strict';

const BaseQuery = require('./baseQuery');

class AggregateQuery extends BaseQuery {
  constructor() {
    super();

    this.extractOptions = false;
    this.mongoMethod = 'find';
    this.autocompleteDefault = 'aggregate({\n  \n})'; //used by codemirror
  }
}

module.exports = AggregateQuery;
