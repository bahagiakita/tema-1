/* ============================================================
   Earthy Botanical — js/user-identifier.js
   Read URL param ?to= → inject guest name
   ============================================================ */

(function () {
  'use strict';

  var urlParams = new URLSearchParams(window.location.search);
  var guestName = urlParams.get('to');
  var guestEl = document.getElementById('landing-guest-name');

  if (guestName && guestEl) {
    var decoded = decodeURIComponent(guestName.replace(/\+/g, ' '));
    guestEl.textContent = decoded;
    window.guestName = decoded;

    var formNameInput = document.getElementById('guest-name');
    if (formNameInput && !formNameInput.value) {
      formNameInput.value = decoded;
    }
  } else if (guestEl) {
    guestEl.textContent = 'Bapak/Ibu/Saudara/i';
    window.guestName = '';
  }

  // Generate a unique user ID for this visitor (for RSVP tracking)
  var storedId = null;
  try {
    storedId = localStorage.getItem('bk_user_id');
  } catch (_) {}

  if (!storedId) {
    storedId = 'bk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    try {
      localStorage.setItem('bk_user_id', storedId);
    } catch (_) {}
  }

  window.userId = storedId;

  console.log('[user-identifier.js] Guest:', guestName || 'anonymous', 'UserID:', storedId);
})();
