'use strict';

const BaseQuery = require('./baseQuery');

class DeleteOneQuery extends BaseQuery {
  constructor() {
    super();

    this.extractOptions = false;
    this.mongoMethod = 'deleteOne';
    this.autocompleteDefault = 'deleteOne({\n  \n})'; //used by codemirror
  }
}

module.exports = DeleteOneQuery;
