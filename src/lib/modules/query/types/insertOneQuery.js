'use strict';

const BaseQuery = require('./baseQuery');

class InsertOneQuery extends BaseQuery {
  constructor(rawQuery) {
    super(rawQuery);

    this.matchRegex = /^(?:insertOne)\(([^]+)\)/;
    this.extractRegex = /^(?:insertOne)\(([^]+)\)/;
    this.mongoMethod = 'find';
    this.autocompleteDefault = 'find({\n  \n})'; //used by codemirror
  }
}

module.exports = InsertOneQuery;
