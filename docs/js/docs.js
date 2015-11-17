$(document).ready(function() {
  initMobileMenu();
});

function initMobileMenu() {
  var showMobileMenuBtn = $('#showMobileMenuBtn');
  showMobileMenuBtn.click(function() {
    $('body').toggleClass('show-mobile-menu');
  });

  var hideMobileMenuBtn = $('#hideMobileMenuBtn');
  hideMobileMenuBtn.click(function() {
    $('body').toggleClass('show-mobile-menu');
  });
}

// function initKeypressEvents() {
//   $(document).keypress(function() {
//
//   });
// }
