'use strict';

const BaseQuery = require('./baseQuery');

class FindQuery extends BaseQuery {
  constructor() {
    super();

    this.extractOptions = false;
    this.mongoMethod = 'find';
    this.autocompleteDefault = 'find({\n  \n})'; //used by codemirror
  }
}

module.exports = FindQuery;
