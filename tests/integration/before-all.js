'use strict';

before(next => {
  console.log('\n--------------------------------------------\nRUNNING INTEGRATION TEST SETUP...\n--------------------------------------------');

  require('src/mongotron').init();

  return next(null);
});

before(next => {
  console.log('\n--------------------------------------------\nFINISHED RUNNING TEST SETUP\n--------------------------------------------');

  return next(null);
});
