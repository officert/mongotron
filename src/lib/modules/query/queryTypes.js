module.exports = {
  find: require('./types/findQuery'),
  aggregate: require('./types/aggregateQuery'),
  deleteMany: require('./types/deleteManyQuery'),
  deleteOne: require('./types/deleteOneQuery'),
  insertOne: require('./types/insertOneQuery'),
  updateMany: require('./types/updateManyQuery'),
  updateOne: require('./types/updateOneQuery')
};
