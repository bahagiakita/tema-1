/* ============================================================
   Earthy Botanical — js/aos.js
   Minimal AOS (Animate on Scroll) — IntersectionObserver based
   ============================================================ */

(function () {
  'use strict';

  var AOS = {
    init: function () {
      var elements = document.querySelectorAll('[data-aos]');
      if (!elements.length) return;

      if (!('IntersectionObserver' in window)) {
        elements.forEach(function (el) { el.classList.add('aos-animate'); });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute('data-aos-delay') || 0;
            setTimeout(function () {
              entry.target.classList.add('aos-animate');
            }, parseInt(delay, 10));
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(function (el) { observer.observe(el); });
    }
  };

  window.AOS = AOS;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AOS.init);
  } else {
    AOS.init();
  }
})();
