'use strict';

before(function(next) {
  console.log('\n--------------------------------------------\nRUNNING UNIT TEST SETUP...\n--------------------------------------------');

  next();
});

before(function(next) {
  console.log('\n--------------------------------------------\nFINISHED RUNNING TEST SETUP\n--------------------------------------------');

  next();
});
