/* ============================================================
   Earthy Botanical — js/script.js (performance-optimized)
   BahagiaKita Wedding Invitation System
   Copyright (c) 2025–2026 Yusuf (BahagiaKita). All Rights Reserved.
   Main interactions: preloader, toggle landing, navbar, 
   gallery lightbox, copy clipboard, music, slideshow, countdown
   ============================================================ */

(function () {
  'use strict';

  // --- Utility: throttle ---
  function throttle(fn, wait) {
    var last = 0, timer = null;
    return function () {
      var now = Date.now();
      var args = arguments;
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      } else {
        clearTimeout(timer);
        timer = setTimeout(function () {
          last = Date.now();
          fn.apply(this, args);
        }, wait - (now - last));
      }
    };
  }

  // --- Preloader ---
  var preloader = document.getElementById('preloader');
  var progressBar = document.getElementById('progress-bar');
  var progressText = document.getElementById('progress-text');
  var minDisplayTime = (typeof weddingConfig !== 'undefined' && weddingConfig.preloader) 
    ? weddingConfig.preloader.minimumDisplayTime : 1500;
  var showProgress = (typeof weddingConfig !== 'undefined' && weddingConfig.preloader)
    ? weddingConfig.preloader.showProgress : true;

  var startTime = Date.now();
  var progress = 0;
  var progressInterval = null;

  function updateProgress() {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.textContent = Math.floor(progress) + '%';
  }

  progressInterval = setInterval(updateProgress, 200);

  var preloaderHidden = false;

  function hidePreloader() {
    if (preloaderHidden) return;
    preloaderHidden = true;
    var elapsed = Date.now() - startTime;
    var remaining = Math.max(0, minDisplayTime - elapsed);
    setTimeout(function () {
      if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.textContent = '100%';
      setTimeout(function () {
        if (preloader) {
          preloader.classList.add('fade-out');
          setTimeout(function () {
            preloader.style.display = 'none';
          }, 500);
        }
      }, 300);
    }, remaining);
  }

  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 6000);

  // --- AOS init — single observer, unobserve after animate ---
  function initAOS() {
    var elements = document.querySelectorAll('[data-aos]:not(.aos-animate)');
    if (elements.length === 0) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  // --- Open Invitation ---
  var openBtn = document.getElementById('open-invite-btn');
  var landingPage = document.getElementById('landing-page');
  var mainInvitePage = document.getElementById('main-invite-page');
  var mainNavbar = document.getElementById('main-navbar');
  var musicControls = document.getElementById('music-controls');
  var backgroundMusic = document.getElementById('background-music');
  var cornerDecorations = document.getElementById('corner-decorations');
  var musicIcon = document.getElementById('music-icon');
  var musicToggleBtn = document.getElementById('music-toggle-btn');
  var desktopLandingCard = document.getElementById('desktop-landing-card');
  var isMusicPlaying = false;

  function openInvitation() {
    if (landingPage) landingPage.classList.add('hidden-landing');
    if (mainInvitePage) {
      mainInvitePage.style.display = 'block';
      mainInvitePage.style.animation = 'fadeIn 0.8s ease';
    }
    // Start music (graceful if file missing)
    var musicEnabled = typeof weddingConfig === 'undefined' || !weddingConfig.music || weddingConfig.music.enabled !== false;
    if (backgroundMusic && musicEnabled && typeof weddingConfig !== 'undefined' && weddingConfig.music && weddingConfig.music.autoplay) {
      backgroundMusic.play().then(function () {
        isMusicPlaying = true;
        if (musicIcon) musicIcon.className = 'bi bi-pause-fill';
      }).catch(function () {
        isMusicPlaying = false;
        if (musicIcon) musicIcon.className = 'bi bi-play-fill';
      });
    } else if (!musicEnabled && musicControls) {
      musicControls.style.display = 'none';
    }

    // Music controls: entrance animation synchronized with navbar
    if (musicControls && musicEnabled) {
      setTimeout(function () {
        musicControls.classList.add('music-enter');
        musicControls.classList.add('visible');
      }, 1600);
    }

    // Corner ornaments: diagonal slide-in + overshoot bounce (after page-open completes ~1.5s)
    if (cornerDecorations) {
      var decors = cornerDecorations.querySelectorAll('.corner-decor');
      setTimeout(function () {
        decors.forEach(function (d) {
          d.classList.remove('wave-ready', 'pop-in');
          void d.offsetWidth;
          d.classList.add('is-visible');
        });
        setTimeout(function () {
          decors.forEach(function (d) {
            d.classList.add('wave-ready');
          });
        }, 1550);
      }, 1600);
    }

    // Welcome content: cascade in after page-open + corner flowers begin
    var welcomeSection = document.getElementById('welcome-section');
    if (welcomeSection) {
      setTimeout(function () {
        welcomeSection.classList.add('welcome-revealed');
      }, 1700);
    }

    // Navbar: slide up after page-open
    if (mainNavbar) {
      setTimeout(function () {
        mainNavbar.classList.add('navbar-enter');
        mainNavbar.classList.remove('hidden-navbar');
      }, 1600);
    }

    // AOS for sections below home — init promptly upon opening
    setTimeout(initAOS, 400);
  }

  if (openBtn) openBtn.addEventListener('click', openInvitation);

  // --- Music toggle ---
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', function () {
      if (!backgroundMusic) return;
      if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        if (musicIcon) musicIcon.className = 'bi bi-play-fill';
      } else {
        backgroundMusic.play();
        isMusicPlaying = true;
        if (musicIcon) musicIcon.className = 'bi bi-pause-fill';
      }
    });
  }

  // --- Countdown timer ---
  function startCountdown() {
    var targetDate;
    if (typeof weddingConfig !== 'undefined' && weddingConfig.welcome && weddingConfig.welcome.countdownDate) {
      targetDate = new Date(weddingConfig.welcome.countdownDate).getTime();
    } else {
      targetDate = new Date('2025-12-15T08:00:00+07:00').getTime();
    }

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    var endedEl = document.getElementById('countdown-ended');
    var countdownWrap = document.getElementById('countdown-wrap');

    function markEnded() {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      if (countdownWrap) countdownWrap.classList.add('countdown-grid--ended');
      if (endedEl) {
        var isIslam = typeof weddingConfig !== 'undefined' && (weddingConfig.religion || 'islam').toLowerCase() === 'islam';
        var text = isIslam ? 'Alhamdulillah, Acara Telah Berlangsung' : 'Acara Telah Berlangsung';
        endedEl.innerHTML = '<i class="bi bi-calendar-check" aria-hidden="true"></i> <span>' + text + '</span>';
        endedEl.hidden = false;
      }
    }

    function update() {
      var now = Date.now();
      var diff = targetDate - now;

      if (diff <= 0) {
        markEnded();
        clearInterval(countdownInterval);
        return;
      }

      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    update();
    var countdownInterval = setInterval(update, 1000);
  }

  startCountdown();

  // --- Slideshow — pause when off-screen ---
  var slideshowInterval = null;
  function initSlideshow() {
    var slides = document.querySelectorAll('.slideshow-img');
    if (slides.length <= 1) return;
    var currentSlide = 0;

    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      slides[currentSlide].classList.add('inactive');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.remove('inactive');
      slides[currentSlide].classList.add('active');
    }

    // Use IntersectionObserver to pause when off-screen
    var slideshowContainer = slides[0].parentElement;
    var slideObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!slideshowInterval) {
            slideshowInterval = setInterval(nextSlide, 4000);
          }
        } else {
          if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
          }
        }
      });
    }, { threshold: 0.1 });
    slideObserver.observe(slideshowContainer);
  }

  initSlideshow();

  // --- Smooth scroll helper (works for window + .main-container) ---
  var mainContainer = document.querySelector('.main-container');
  var isScrollingNav = false;
  var scrollAnimId = null;

  function getScrollParent() {
    if (mainContainer) {
      var oy = window.getComputedStyle(mainContainer).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && mainContainer.scrollHeight > mainContainer.clientHeight + 2) {
        return mainContainer;
      }
    }
    return document.scrollingElement || document.documentElement;
  }

  function getScrollTop(el) {
    if (el === window || el === document.documentElement || el === document.body || el === document.scrollingElement) {
      return window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    return el.scrollTop;
  }

  function setScrollTop(el, value) {
    if (el === window || el === document.documentElement || el === document.body || el === document.scrollingElement) {
      window.scrollTo(0, value);
    } else {
      el.scrollTop = value;
    }
  }

  function smoothScrollTo(targetEl, duration) {
    if (!targetEl) return;
    duration = duration || 780;
    var scroller = getScrollParent();
    var start = getScrollTop(scroller);
    var navbarH = (mainNavbar && mainNavbar.offsetHeight) ? mainNavbar.offsetHeight : 72;
    var offset = navbarH + 12;
    var rect = targetEl.getBoundingClientRect();
    var scrollerTop = 0;
    if (scroller !== window && scroller !== document.documentElement && scroller !== document.body && scroller !== document.scrollingElement) {
      scrollerTop = scroller.getBoundingClientRect().top;
    }
    var end = start + (rect.top - scrollerTop) - offset;
    end = Math.max(0, end);
    var change = end - start;
    if (Math.abs(change) < 2) return;
    var t0 = null;
    if (scrollAnimId) cancelAnimationFrame(scrollAnimId);
    isScrollingNav = true;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / duration);
      setScrollTop(scroller, start + change * easeInOutCubic(p));
      if (p < 1) {
        scrollAnimId = requestAnimationFrame(step);
      } else {
        scrollAnimId = null;
        setTimeout(function () { isScrollingNav = false; }, 80);
      }
    }
    scrollAnimId = requestAnimationFrame(step);
  }

  // --- Bottom navbar ---
  var navbarItems = document.querySelectorAll('.navbar-item');
  navbarItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = this.getAttribute('data-target');
      var targetEl = document.getElementById(target);
      if (targetEl) smoothScrollTo(targetEl, 780);
      navbarItems.forEach(function (i) { i.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // Navbar active state on scroll — throttled + passive
  var sections = document.querySelectorAll('section[id]');

  var updateNavbarActive = throttle(function () {
    if (isScrollingNav) return;
    var scroller = getScrollParent();
    var scrollPos = getScrollTop(scroller);

    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      var top = section.offsetTop - 100;
      var bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        var id = section.getAttribute('id');
        for (var j = 0; j < navbarItems.length; j++) {
          navbarItems[j].classList.toggle('active', navbarItems[j].getAttribute('data-target') === id);
        }
        break;
      }
    }
  }, 100);

  if (mainContainer) {
    mainContainer.addEventListener('scroll', updateNavbarActive, { passive: true });
  }
  window.addEventListener('scroll', updateNavbarActive, { passive: true });

  // --- Gallery lightbox ---
  var galleryGrid = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('gallery-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxCur = document.getElementById('lightbox-cur');
  var lightboxTotal = document.getElementById('lightbox-total');
  var currentLightboxIdx = 0;
  var galleryImages = [];

  function collectGalleryImages() {
    galleryImages = [];
    var items = galleryGrid ? galleryGrid.querySelectorAll('.gallery-item img') : [];
    items.forEach(function (img) {
      galleryImages.push(img.src);
    });
    if (lightboxTotal) lightboxTotal.textContent = galleryImages.length;
  }

  var lastFocusEl = null;

  function openLightbox(idx) {
    if (!lightbox || galleryImages.length === 0) return;
    currentLightboxIdx = idx;
    if (lightboxImg) lightboxImg.src = galleryImages[idx];
    if (lightboxCur) lightboxCur.textContent = idx + 1;
    lastFocusEl = document.activeElement;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
      try { lastFocusEl.focus(); } catch (_) {}
    }
  }

  function nextLightbox() {
    currentLightboxIdx = (currentLightboxIdx + 1) % galleryImages.length;
    if (lightboxImg) lightboxImg.src = galleryImages[currentLightboxIdx];
    if (lightboxCur) lightboxCur.textContent = currentLightboxIdx + 1;
  }

  function prevLightbox() {
    currentLightboxIdx = (currentLightboxIdx - 1 + galleryImages.length) % galleryImages.length;
    if (lightboxImg) lightboxImg.src = galleryImages[currentLightboxIdx];
    if (lightboxCur) lightboxCur.textContent = currentLightboxIdx + 1;
  }

  // Delegated click for gallery items
  if (galleryGrid) {
    galleryGrid.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (!item) return;
      collectGalleryImages();
      var idx = parseInt(item.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') nextLightbox();
    else if (e.key === 'ArrowLeft') prevLightbox();
    else if (e.key === 'Escape') closeLightbox();
  });

  // Touch swipe for lightbox
  var touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      var touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextLightbox();
        else prevLightbox();
      }
    }, { passive: true });
  }

  // --- Gallery Expand / Collapse Toggle ---
  document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('#gallery-toggle-btn');
    if (!toggleBtn) return;

    var grid = document.getElementById('gallery-grid');
    if (!grid) return;

    var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    var totalCount = toggleBtn.getAttribute('data-total') || '';
    var textSpan = toggleBtn.querySelector('.btn-text');

    if (!isExpanded) {
      // Buka semua foto yang tersembunyi
      var hiddenItems = grid.querySelectorAll('.gallery-item--hidden');
      hiddenItems.forEach(function (el) {
        el.classList.remove('gallery-item--hidden');
        el.classList.add('gallery-item--revealed');
      });
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.classList.add('expanded');
      if (textSpan) textSpan.textContent = 'Tampilkan Lebih Sedikit';
    } else {
      // Tutup kembali foto yang tadi dibuka
      var revealedItems = grid.querySelectorAll('.gallery-item--revealed');
      revealedItems.forEach(function (el) {
        el.classList.remove('gallery-item--revealed');
        el.classList.add('gallery-item--hidden');
      });
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('expanded');
      if (textSpan) textSpan.textContent = 'Lihat Semua Foto (' + totalCount + ')';

      // Scroll halus kembali ke posisi gallery-section
      var gallerySection = document.getElementById('galeri-section');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    if (window.AOS && typeof window.AOS.refresh === 'function') {
      window.AOS.refresh();
    }
  });

  // --- Copy to clipboard ---
  function fallbackCopyText(text) {
    try {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      var successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (_) {
      return false;
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var targetId = btn.getAttribute('data-target');
    var notifId = btn.getAttribute('data-notif');
    var targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    var text = targetEl.textContent.trim();

    function onSuccess() {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(40); } catch (_) {}
      }
      var notif = document.getElementById(notifId);
      if (notif) {
        notif.classList.add('visible');
        setTimeout(function () { notif.classList.remove('visible'); }, 2000);
      }
      if (window.showNotification) showNotification('Nomor rekening berhasil disalin!', 'success');
    }

    function onError() {
      if (window.showNotification) showNotification('Gagal menyalin. Silakan salin manual.', 'info');
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
        fallbackCopyText(text) ? onSuccess() : onError();
      });
    } else {
      fallbackCopyText(text) ? onSuccess() : onError();
    }
  });

  // --- Gift open/close ---
  var openGiftBtn = document.getElementById('open-gift-btn');
  var giftContent = document.getElementById('gift-content');
  if (openGiftBtn && giftContent) {
    openGiftBtn.addEventListener('click', function () {
      var isHidden = giftContent.hidden || giftContent.style.display === 'none' || giftContent.classList.contains('gift-closing');
      if (isHidden) {
        giftContent.hidden = false;
        giftContent.style.display = 'block';
        giftContent.classList.remove('gift-closing');
        giftContent.classList.add('gift-opening');
        openGiftBtn.innerHTML = '<i class="bi bi-envelope" aria-hidden="true"></i> Tutup Amplop';
      } else {
        giftContent.classList.remove('gift-opening');
        giftContent.classList.add('gift-closing');
        openGiftBtn.innerHTML = '<i class="bi bi-envelope-heart" aria-hidden="true"></i> Buka Amplop';
        setTimeout(function () {
          giftContent.hidden = true;
          giftContent.style.display = 'none';
          giftContent.classList.remove('gift-closing');
        }, 400);
      }
    });
  }

  // --- prefers-reduced-motion ---
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion');
  }

  // --- Notification popup ---
  var notifPopup = document.getElementById('notification-popup');
  var notifPopupText = document.getElementById('notif-popup-text');
  var notifPopupIcon = document.getElementById('notif-popup-icon');
  var notifTimer = null;

  window.showNotification = function (message, type) {
    if (!notifPopup) return;
    if (notifPopupText) notifPopupText.textContent = message;
    if (notifPopupIcon) {
      notifPopupIcon.className = 'notif-icon ' + (type || 'success');
      notifPopupIcon.innerHTML = type === 'success' 
        ? '<i class="bi bi-check-lg"></i>' 
        : '<i class="bi bi-info-circle"></i>';
    }
    notifPopup.classList.add('visible');
    if (notifTimer) clearTimeout(notifTimer);
    notifTimer = setTimeout(function () {
      notifPopup.classList.remove('visible');
    }, 3000);
  };

  // Init AOS for elements visible on load
  setTimeout(initAOS, 500);
})();
