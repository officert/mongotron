'use strict';

const remote = require('remote');

let updateBtn = document.getElementById('update-btn');
let cancelBtn = document.getElementById('cancel-btn');

if (updateBtn) {
  updateBtn.addEventListener('click', event => {
    if (event) event.preventDefault();

    alert('update!!');
  });
}
if (cancelBtn) {
  cancelBtn.addEventListener('click', event => {
    if (event) event.preventDefault();

    var window = remote.getCurrentWindow();
    window.close();
  });
}
