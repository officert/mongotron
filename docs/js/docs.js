$(document).ready(function() {
  initMobileMenu();
  initProductHuntBanner();
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

function initProductHuntBanner() {
  var refParam = getParameterByName('ref');

  if (refParam === 'producthunt') {
    $('#producthunt').show();
  }
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
