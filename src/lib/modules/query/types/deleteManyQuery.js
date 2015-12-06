'use strict';

const BaseQuery = require('./baseQuery');

class DeleteManyQuery extends BaseQuery {
  constructor() {
    super();

    this.extractOptions = false;
    this.mongoMethod = 'deleteMany';
    this.autocompleteDefault = 'deleteMany({\n  \n})'; //used by codemirror
  }
}

module.exports = DeleteManyQuery;
