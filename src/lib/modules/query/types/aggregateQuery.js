'use strict';

const BaseQuery = require('./baseQuery');

class AggregateQuery extends BaseQuery {
  constructor(rawQuery) {
    super(rawQuery);

    this.matchRegex = /^(?:aggregate)\(([^]+)\)/;
    this.extractRegex = /^(?:aggregate)\(([^]+)\)/;
    this.mongoMethod = 'find';
    this.autocompleteDefault = 'find({\n  \n})'; //used by codemirror
  }
}

module.exports = AggregateQuery;
