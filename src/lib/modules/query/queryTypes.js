module.exports = {
  find: {
    mongoMethod: 'find',
    extractOptions: false,
    autocompleteDefault: 'find({\n  \n})'
  },
  aggregate: {
    mongoMethod: 'aggregate',
    extractOptions: false,
    autocompleteDefault: 'aggregate({\n  \n})'
  },
  deleteMany: {
    mongoMethod: 'deleteMany',
    extractOptions: false,
    autocompleteDefault: 'deleteMany({\n  \n})'
  },
  deleteOne: {
    mongoMethod: 'deleteOne',
    extractOptions: false,
    autocompleteDefault: 'deleteOne({\n  \n})'
  },
  insertOne: {
    mongoMethod: 'insertOne',
    extractOptions: false,
    autocompleteDefault: 'insertOne({\n  \n})'
  },
  updateMany: {
    mongoMethod: 'updateMany',
    extractOptions: true,
    autocompleteDefault: 'updateMany({\n  \n})'
  },
  updateOne: {
    mongoMethod: 'updateOne',
    extractOptions: true,
    autocompleteDefault: 'updateOne({\n  \n})'
  }
};
