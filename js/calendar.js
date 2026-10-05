/* ============================================================
   Earthy Botanical — js/calendar.js
   Generate .ics file from "Save to Date" button
   ============================================================ */

(function () {
  'use strict';

  var saveBtn = document.getElementById('save-to-date-btn');

  if (!saveBtn) return;

  saveBtn.addEventListener('click', function () {
    var config = typeof weddingConfig !== 'undefined' ? weddingConfig : {};
    var weddingDate = config.welcome ? config.welcome.weddingDate : '15 Desember 2025';
    var countdownDate = config.welcome ? config.welcome.countdownDate : '2025-12-15T08:00:00+07:00';

    var dateObj = new Date(countdownDate);
    if (isNaN(dateObj.getTime())) dateObj = new Date('2025-12-15T08:00:00+07:00');

    var maleName = config.male ? config.male.nickname : 'Ahmad';
    var femaleName = config.female ? config.female.nickname : 'Fatimah';

    var startDate = formatICSDate(dateObj);
    var endDate = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000); // +4 hours
    var endICS = formatICSDate(endDate);

    var venue = '';
    if (config.events && config.events.resepsi) {
      venue = config.events.resepsi.venue || '';
    }
    var address = '';
    if (config.events && config.events.resepsi) {
      address = config.events.resepsi.address || '';
    }

    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BahagiaKita//Wedding Invitation//ID',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@bahagiakita.my.id',
      'DTSTAMP:' + formatICSDate(new Date()),
      'DTSTART:' + startDate,
      'DTEND:' + endICS,
      'SUMMARY:The Wedding Of ' + maleName + ' & ' + femaleName,
      'DESCRIPTION:Undangan Pernikahan ' + maleName + ' & ' + femaleName,
      'LOCATION:' + venue + (address ? ', ' + address : ''),
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Wedding Tomorrow!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-' + maleName + '-' + femaleName + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.showNotification) {
      window.showNotification('File kalender berhasil diunduh!', 'success');
    }
  });

  function formatICSDate(date) {
    var year = date.getUTCFullYear();
    var month = String(date.getUTCMonth() + 1).padStart(2, '0');
    var day = String(date.getUTCDate()).padStart(2, '0');
    var hours = String(date.getUTCHours()).padStart(2, '0');
    var minutes = String(date.getUTCMinutes()).padStart(2, '0');
    var seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return year + month + day + 'T' + hours + minutes + seconds + 'Z';
  }

  console.log('[calendar.js] Initialized.');
})();
