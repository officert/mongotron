'use strict';

const BaseQuery = require('./baseQuery');

class FindQuery extends BaseQuery {
  constructor(rawQuery) {
    super(rawQuery);

    this.matchRegex = /^(?:find)\(([^]+)\)/;
    this.extractRegex = /^(?:find)\(([^]+)\)/;
    this.mongoMethod = 'find';
    this.autocompleteDefault = 'find({\n  \n})'; //used by codemirror
  }
}

module.exports = FindQuery;
