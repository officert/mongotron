'use strict';

const BaseQuery = require('./baseQuery');

class InsertOneQuery extends BaseQuery {
  constructor() {
    super();

    this.extractOptions = false;
    this.mongoMethod = 'insertOne';
    this.autocompleteDefault = 'insertOne({\n  \n})'; //used by codemirror
  }
}

module.exports = InsertOneQuery;
