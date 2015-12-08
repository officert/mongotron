module.exports = {
  find: {
    mongoMethod: 'find',
    extractOptions: false
  },
  aggregate: {
    mongoMethod: 'aggregate',
    extractOptions: false
  },
  deleteMany: {
    mongoMethod: 'deleteMany',
    extractOptions: false
  },
  deleteOne: {
    mongoMethod: 'deleteOne',
    extractOptions: false
  },
  insertOne: {
    mongoMethod: 'insertOne',
    extractOptions: false
  },
  updateMany: {
    mongoMethod: 'updateMany',
    extractOptions: true
  },
  updateOne: {
    mongoMethod: 'updateOne',
    extractOptions: true
  }
};
