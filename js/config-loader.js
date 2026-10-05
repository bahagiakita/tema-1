/* ============================================================
   Earthy Botanical — js/config-loader.js
   BahagiaKita Wedding Invitation System
   Copyright (c) 2025–2026 Yusuf (BahagiaKita). All Rights Reserved.
   by-ID mapping: weddingConfig → DOM elements
   Multi-Religion Presets & Default Asset Multi-Theme Fallbacks
   ============================================================ */

(function () {
  if (typeof weddingConfig === 'undefined') {
    console.error('[config-loader] weddingConfig is not defined. Please load wedding-config.js first.');
    return;
  }

  var config = weddingConfig;
  var hasPhotos = config.hasPhotos !== false;

  // --- 1. Religion & Multi-Theme Asset Resolution ---
  var religion = (config.religion || 'islam').toLowerCase();
  var isIslam = religion === 'islam';
  var assetCategory = isIslam ? 'islamic' : 'universal';

  // Load Arabic calligraphy font only for Islamic ceremonies
  if (isIslam && !document.getElementById('amiri-font-link')) {
    var amiriFont = document.createElement('link');
    amiriFont.id = 'amiri-font-link';
    amiriFont.rel = 'stylesheet';
    amiriFont.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
    document.head.appendChild(amiriFont);
  }

  var DEFAULT_ASSETS = {
    profile: {
      pria: './images/no_photos/' + assetCategory + '/profile/pria.webp',
      wanita: './images/no_photos/' + assetCategory + '/profile/wanita.webp',
      male: './images/no_photos/' + assetCategory + '/profile/pria.webp',
      female: './images/no_photos/' + assetCategory + '/profile/wanita.webp'
    },
    welcome: './images/no_photos/' + assetCategory + '/welcome/main.webp',
    cover: './images/no_photos/' + assetCategory + '/cover/cover.webp',
    seo: './images/no_photos/' + assetCategory + '/seo/og-image.jpg'
  };

  // --- 2. Built-in Multi-Religion Copywriting Presets ---
  var RELIGION_PRESETS = {
    islam: {
      welcomeMessage: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.",
      mempelaiSalam: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
      mempelaiIntro: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
      doaHeading: "Doa",
      doaSubtitle: "Ayat suci Al-Qur'an untuk kedua mempelai",
      arabicDoa: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
      doaTranslation: "Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.",
      doaSource: "Q.S Ar-Rum : 21",
      primaryEventTitle: "Akad Nikah",
      thankYouMessage: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
      thankYouClosing: "Jazakumullah khairan katsiran",
      showArabic: true
    },
    kristen: {
      welcomeMessage: "Dengan kasih karunia dan damai sejahtera dari Tuhan Yesus Kristus, kami mengundang Anda untuk merayakan pernikahan putra-putri kami.",
      mempelaiSalam: "Salam Sejahtera dalam Kasih Tuhan Yesus Kristus",
      mempelaiIntro: "Atas kasih karunia dan kebaikan Tuhan yang telah mempersatukan kami, dengan sukacita kami mengundang kehadiran Anda pada pernikahan putra-putri kami:",
      doaHeading: "Ayat Kasih",
      doaSubtitle: "Firman Tuhan untuk kedua mempelai",
      arabicDoa: "",
      doaTranslation: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Kasih menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu. Kasih tidak berkesudahan.",
      doaSource: "1 Korintus 13:4-7, 8a",
      primaryEventTitle: "Pemberkatan Nikah",
      thankYouMessage: "Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan berkat dan sukacita yang teramat berharga bagi kami.",
      thankYouClosing: "Tuhan Yesus Memberkati Kita Semua",
      showArabic: false
    },
    katolik: {
      welcomeMessage: "Atas berkat dan kasih karunia Allah Bapa melalui Yesus Kristus, kami bermaksud menyelenggarakan sakramen pernikahan putra-putri kami.",
      mempelaiSalam: "Damai Kristus Bersama Kita",
      mempelaiIntro: "Dalam bimbingan Roh Kudus dan kasih Kristus yang suci, kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan sakramen perkawinan putra-putri kami:",
      doaHeading: "Firman Pernikahan",
      doaSubtitle: "Sabda Allah untuk kedua mempelai",
      arabicDoa: "",
      doaTranslation: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.",
      doaSource: "Matius 19:6",
      primaryEventTitle: "Sakramen Pernikahan",
      thankYouMessage: "Merupakan suatu berkat dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
      thankYouClosing: "Berkah Dalem & Salam Kasih Kristus",
      showArabic: false
    },
    hindu: {
      welcomeMessage: "Om Swastyastu, atas asung kerta wara nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud menyelenggarakan upacara pawiwahan putra-putri kami.",
      mempelaiSalam: "Om Swastyastu",
      mempelaiIntro: "Atas asung kerta wara nugraha Ida Sang Hyang Widhi Wasa, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan upacara pawiwahan putra-putri kami:",
      doaHeading: "Sloka Suci Weda",
      doaSubtitle: "Untaian doa suci untuk kedua mempelai",
      arabicDoa: "",
      doaTranslation: "Semoga pasangan ini dianugerahi kebahagiaan abadi, hidup rukun berdampingan, dan dikaruniai keturunan yang utama dalam naungan Dharma.",
      doaSource: "Rgveda X.85.42",
      primaryEventTitle: "Upacara Pawiwahan",
      thankYouMessage: "Merupakan kehormatan dan kebahagiaan bagi kami atas kehadiran serta doa restu Bapak/Ibu/Saudara/i sekalian.",
      thankYouClosing: "Om Shanti, Shanti, Shanti, Om",
      showArabic: false
    },
    buddha: {
      welcomeMessage: "Namo Buddhaya, dengan penuh sukacita dan rasa syukur kepada Tiratana, kami bermaksud menyelenggarakan pemberkahan pernikahan kami.",
      mempelaiSalam: "Namo Buddhaya",
      mempelaiIntro: "Dengan penuh rasa syukur dan sukacita dalam naungan Sang Tiratana, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan pemberkahan pernikahan putra-putri kami:",
      doaHeading: "Paritta Pernikahan",
      doaSubtitle: "Untaian Dhamma untuk kedua mempelai",
      arabicDoa: "",
      doaTranslation: "Saling menghargai, setia, dan penuh welas asih adalah fondasi utama yang mendatangkan kedamaian, kebahagiaan, dan berkah dalam kehidupan berumah tangga.",
      doaSource: "Mangala Sutta",
      primaryEventTitle: "Pemberkahan Nikah",
      thankYouMessage: "Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan berkah dan kebahagiaan yang sangat bermakna bagi kami.",
      thankYouClosing: "Sabbe Satta Bhavantu Sukhitatta",
      showArabic: false
    },
    universal: {
      welcomeMessage: "Dengan penuh rasa syukur dan sukacita yang mendalam, kami mengundang Anda untuk menjadi bagian dari perayaan janji suci pernikahan kami.",
      mempelaiSalam: "Salam Hangat & Penuh Cinta",
      mempelaiIntro: "Bersama keluarga besar kami yang berbahagia, dengan penuh rasa syukur kami mengundang kehadiran Anda untuk merayakan ikatan cinta suci putra-putri kami:",
      doaHeading: "Kutipan Kasih",
      doaSubtitle: "Untaian kata cinta untuk kedua mempelai",
      arabicDoa: "",
      doaTranslation: "Cinta tidak meminta kepemilikan, cinta mencukupi cinta. Berjalanlah bersama dalam harmoni, saling percaya, dan saling mengasihi sepanjang masa.",
      doaSource: "Kahlil Gibran",
      primaryEventTitle: "Janji Suci",
      thankYouMessage: "Merupakan kehormatan dan kebahagiaan terbesar bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
      thankYouClosing: "Salam Hangat & Doa Terbaik untuk Kita Semua",
      showArabic: false
    }
  };

  var currentPreset = RELIGION_PRESETS[religion] || RELIGION_PRESETS.islam;

  function resolveImage(customSrc, fallbackSrc) {
    if (!hasPhotos) return fallbackSrc;
    return (customSrc && typeof customSrc === 'string' && customSrc.trim() !== '') ? customSrc : fallbackSrc;
  }

  function resolveText(customText, fallbackText) {
    return (customText && typeof customText === 'string' && customText.trim() !== '') ? customText : fallbackText;
  }

  function resolvePresetOrCustom(customText, presetText, defaultIslamicText) {
    if (!customText || typeof customText !== 'string' || customText.trim() === '') {
      return presetText;
    }
    if (!isIslam && defaultIslamicText && customText.trim() === defaultIslamicText.trim()) {
      return presetText;
    }
    return customText;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }

  function setSrc(id, src) {
    var el = document.getElementById(id);
    if (el && src) el.src = src;
  }

  function setHref(id, href) {
    var el = document.getElementById(id);
    if (el && href) el.href = href;
  }

  function setHTML(id, html) {
    var el = document.getElementById(id);
    if (el && html != null) el.innerHTML = html;
  }

  function setMeta(selector, attr, value) {
    var el = document.querySelector(selector);
    if (el && value) el.setAttribute(attr, value);
  }

  function toAbsUrl(url) {
    if (!url) return '';
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) return url;
    try { return new URL(url, window.location.href).href; } catch (_) { return url; }
  }

  // --- SEO ---
  document.title = config.seo.pageTitle || 'Wedding Invitation';
  setMeta('meta[name="description"]', 'content', config.seo.metaDescription || '');
  var metaKeywords = config.seo.metaKeywords || '';
  if (!isIslam && metaKeywords) {
    metaKeywords = metaKeywords.replace(/\bislamic wedding\b/gi, 'wedding ceremony');
  }
  setMeta('meta[name="keywords"]', 'content', metaKeywords);
  if (config.seo.openGraph) {
    setMeta('meta[property="og:title"]', 'content', config.seo.openGraph.title);
    setMeta('meta[property="og:description"]', 'content', config.seo.openGraph.description);
    var ogImageSrc = resolveImage(config.seo.openGraph.image, DEFAULT_ASSETS.seo);
    setMeta('meta[property="og:image"]', 'content', toAbsUrl(ogImageSrc));
    setMeta('meta[property="og:url"]', 'content', config.seo.openGraph.url);
  }
  if (config.seo.twitter) {
    setMeta('meta[name="twitter:title"]', 'content', config.seo.twitter.title);
    setMeta('meta[name="twitter:description"]', 'content', config.seo.twitter.description);
    var twitterImageSrc = resolveImage(config.seo.twitter.image, DEFAULT_ASSETS.seo);
    setMeta('meta[name="twitter:image"]', 'content', toAbsUrl(twitterImageSrc));
  }
  if (config.seo.favicon) {
    var fav = document.querySelector('link[rel="icon"]');
    if (fav) fav.setAttribute('href', config.seo.favicon);
  }

  // --- JSON-LD Schema.org Structured Data ---
  var schemaScript = document.getElementById('wedding-schema');
  if (schemaScript && config.seo) {
    var groomFull = (config.pria && config.pria.fullName) || (config.male && config.male.fullName) || 'Mempelai Pria';
    var brideFull = (config.wanita && config.wanita.fullName) || (config.female && config.female.fullName) || 'Mempelai Wanita';
    var eventDate = (config.welcome && config.welcome.countdownDate) || '2025-12-15T08:00:00+07:00';
    var primaryEvent = (config.events && config.events.akadNikah) || (config.events && config.events.resepsi) || {};
    var eventVenue = primaryEvent.venue || 'Venue Acara';
    var eventAddress = primaryEvent.address || '';
    var eventImage = (config.seo.openGraph && config.seo.openGraph.image) 
      ? toAbsUrl(resolveImage(config.seo.openGraph.image, DEFAULT_ASSETS.seo))
      : toAbsUrl(DEFAULT_ASSETS.cover);

    var ldJson = {
      "@context": "https://schema.org",
      "@type": "SocialEvent",
      "name": config.seo.pageTitle || ('The Wedding Of ' + groomFull + ' & ' + brideFull),
      "description": config.seo.metaDescription || 'Undangan Pernikahan Digital',
      "startDate": eventDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": eventVenue,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": eventAddress
        }
      },
      "image": [eventImage],
      "organizer": {
        "@type": "Person",
        "name": groomFull + ' & ' + brideFull
      }
    };
    schemaScript.textContent = JSON.stringify(ldJson, null, 2);
  }

  // --- Mempelai Pria (Groom) ---
  var priaConfig = config.pria || config.male;
  if (priaConfig) {
    setText('groom-fullname', priaConfig.fullName);
    setText('groom-child-order', priaConfig.childOrder);
    var groomFather = (priaConfig.parents && priaConfig.parents.father) || '';
    var groomMother = (priaConfig.parents && priaConfig.parents.mother) || '';
    setHTML('groom-parents', (groomFather && groomMother) ? (groomFather + '<br>' + groomMother) : (groomFather || groomMother));
    setText('groom-instagram', priaConfig.instagram);
    setHref('groom-instagram-link', priaConfig.instagramLink);
    setSrc('groom-photo', resolveImage(priaConfig.photo, DEFAULT_ASSETS.profile.pria));
  }

  // --- Mempelai Wanita (Bride) ---
  var wanitaConfig = config.wanita || config.female;
  if (wanitaConfig) {
    setText('bride-fullname', wanitaConfig.fullName);
    setText('bride-child-order', wanitaConfig.childOrder);
    var brideFather = (wanitaConfig.parents && wanitaConfig.parents.father) || '';
    var brideMother = (wanitaConfig.parents && wanitaConfig.parents.mother) || '';
    setHTML('bride-parents', (brideFather && brideMother) ? (brideFather + '<br>' + brideMother) : (brideFather || brideMother));
    setText('bride-instagram', wanitaConfig.instagram);
    setHref('bride-instagram-link', wanitaConfig.instagramLink);
    setSrc('bride-photo', resolveImage(wanitaConfig.photo, DEFAULT_ASSETS.profile.wanita));
  }

  // --- Couple names auto-generate ---
  var maleName = (priaConfig && priaConfig.nickname) || '';
  var femaleName = (wanitaConfig && wanitaConfig.nickname) || '';
  var coupleNames = maleName + ' & ' + femaleName;
  setText('couple-names-landing', coupleNames);
  setHTML('couple-names-landing-mobile', coupleNames);
  setText('couple-names-welcome', coupleNames);
  setText('thankyou-couple-names', coupleNames);

  // --- Welcome Section ---
  setText('wedding-date', config.welcome.weddingDate);
  var defaultIslamicWelcome = "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.";
  setText('welcome-message', resolvePresetOrCustom(config.welcome && config.welcome.message, currentPreset.welcomeMessage, defaultIslamicWelcome));

  // --- Cover / landing background (mobile) ---
  var coverImage = resolveImage(config.welcome && config.welcome.coverImage, DEFAULT_ASSETS.cover);
  var coverPosition = (config.welcome && config.welcome.coverPosition) || 'center center';
  if (coverImage) {
    setSrc('landing-bg-image', coverImage);
    var landingBg = document.getElementById('landing-bg-image');
    if (landingBg) landingBg.style.objectPosition = coverPosition;
  }

  // --- Desktop Left Sidebar Background ---
  var desktopCard = document.getElementById('desktop-landing-card');
  if (desktopCard) {
    var desktopBg = (config.desktop && config.desktop.backgroundImage) || './images/furnitur/background.webp';
    var desktopPos = (config.desktop && config.desktop.backgroundPosition) || 'center center';
    desktopCard.style.backgroundImage = "url('" + desktopBg + "')";
    desktopCard.style.backgroundPosition = desktopPos;
  }

  // --- Welcome Hero Circle / Slideshow ---
  var slideshowRing = document.querySelector('.welcome-photo-ring');
  var photoPosition = (config.welcome && config.welcome.photoPosition) || 'center center';
  if (slideshowRing) {
    if (!hasPhotos) {
      slideshowRing.innerHTML = '<img src="' + DEFAULT_ASSETS.welcome + '" alt="Earthy Botanical" class="slideshow-img active" />';
    } else if (config.welcome && config.welcome.slideshowImages && config.welcome.slideshowImages.length > 0) {
      var slidesHtml = '';
      config.welcome.slideshowImages.forEach(function (src, idx) {
        slidesHtml += '<img src="' + src + '" alt="Hero ' + (idx + 1) + '" class="slideshow-img' + (idx === 0 ? ' active' : '') + '" />';
      });
      slideshowRing.innerHTML = slidesHtml;
    }
    var imgs = slideshowRing.querySelectorAll('.slideshow-img');
    imgs.forEach(function (img) {
      img.style.objectPosition = photoPosition;
    });
  }

  // --- Doa / Scripture / Quotes Section ---
  if (config.doa && config.doa.enabled) {
    setText('doa-heading', resolvePresetOrCustom(config.doa.title, currentPreset.doaHeading, "Doa"));
    setText('doa-subtitle', currentPreset.doaSubtitle);

    var doaArabEl = document.getElementById('doa-arabic');
    if (doaArabEl) {
      if (currentPreset.showArabic) {
        var arabicText = (config.doa.ayat && config.doa.ayat.arabic) ? config.doa.ayat.arabic : currentPreset.arabicDoa;
        doaArabEl.innerHTML = arabicText;
        doaArabEl.style.display = arabicText ? '' : 'none';
      } else {
        doaArabEl.style.display = 'none';
      }
    }

    var defaultIslamicTranslation = "Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.";
    var defaultIslamicSource = "Q.S Ar-Rum : 21";

    var trans = resolvePresetOrCustom(config.doa.ayat && config.doa.ayat.translation, currentPreset.doaTranslation, defaultIslamicTranslation);
    setText('doa-translation', trans);
    var src = resolvePresetOrCustom(config.doa.ayat && config.doa.ayat.source, currentPreset.doaSource, defaultIslamicSource);
    setText('doa-source', src);
  } else {
    var doaSection = document.getElementById('doa-section');
    if (doaSection) doaSection.style.display = 'none';
  }

  // --- Mempelai Greetings & Arabic Auto-Hide ---
  var bismillahEl = document.getElementById('mempelai-bismillah');
  if (bismillahEl) {
    bismillahEl.style.display = currentPreset.showArabic ? '' : 'none';
  }
  setText('mempelai-assalam', currentPreset.mempelaiSalam);
  setText('mempelai-intro', currentPreset.mempelaiIntro);

  // --- Events: Event 1 (Akad Nikah / Pemberkatan / Pawiwahan) ---
  var event1 = config.events && (config.events.akadNikah || config.events.pemberkatan || config.events.primaryEvent || config.events.event1);
  if (event1 && event1.enabled !== false) {
    setText('akad-title', resolvePresetOrCustom(event1.title, currentPreset.primaryEventTitle, "Akad Nikah"));
    setText('akad-day', event1.day);
    setText('akad-month', event1.month);
    setText('akad-day-name', event1.dayName);
    setText('akad-time', event1.time);
    setText('akad-venue', event1.venue);
    setText('akad-address', event1.address);
    setHref('akad-maps-link', event1.mapsLink);
  } else {
    var akadCard = document.getElementById('akad-card') || document.querySelector('[data-od-id="akad-card"]');
    if (akadCard) akadCard.style.display = 'none';
  }

  // --- Events: Resepsi ---
  if (config.events && config.events.resepsi && config.events.resepsi.enabled !== false) {
    setText('resepsi-day', config.events.resepsi.day);
    setText('resepsi-month', config.events.resepsi.month);
    setText('resepsi-day-name', config.events.resepsi.dayName);
    setText('resepsi-time', config.events.resepsi.time);
    setText('resepsi-venue', config.events.resepsi.venue);
    setText('resepsi-address', config.events.resepsi.address);
    setHref('resepsi-maps-link', config.events.resepsi.mapsLink);
  } else {
    var resepsiCard = document.querySelector('[data-od-id="resepsi-card"]');
    if (resepsiCard) resepsiCard.style.display = 'none';
  }

  // --- Live Streaming ---
  if (config.events && config.events.liveStreaming && config.events.liveStreaming.enabled) {
    setText('livestream-description', config.events.liveStreaming.description);
    setHref('livestream-link', config.events.liveStreaming.link);
    setText('livestream-button-text', config.events.liveStreaming.buttonText);
  } else {
    var liveSection = document.getElementById('livestream-card');
    if (liveSection) liveSection.style.display = 'none';
  }

  // --- Dress Code ---
  if (config.dressCode && config.dressCode.enabled) {
    setText('dress-theme', config.dressCode.theme);
    setText('dress-men', config.dressCode.recommendations.men);
    setText('dress-women', config.dressCode.recommendations.women);
    setText('dress-note', config.dressCode.recommendations.note);

    var colorsContainer = document.getElementById('dress-colors');
    if (colorsContainer && config.dressCode.colors) {
      colorsContainer.innerHTML = '';
      config.dressCode.colors.forEach(function (color) {
        var hex = typeof color === 'string' ? color : color.hex;
        var name = typeof color === 'string' ? '' : (color.name || '');
        var wrap = document.createElement('div');
        wrap.className = 'dress-color-swatch';
        wrap.innerHTML =
          '<div class="dress-color-circle" style="background:' + hex + ';"></div>' +
          (name ? '<span class="dress-color-name">' + name + '</span>' : '');
        colorsContainer.appendChild(wrap);
      });
    }

    var inspContainer = document.getElementById('dress-inspiration');
    if (inspContainer && config.dressCode.inspirationImages) {
      inspContainer.innerHTML = '';
      config.dressCode.inspirationImages.forEach(function (item) {
        var src = typeof item === 'string' ? item : item.src;
        var label = typeof item === 'string' ? '' : (item.label || '');
        var fig = document.createElement('figure');
        fig.className = 'dress-insp-card';
        fig.innerHTML =
          '<img src="' + src + '" alt="' + (label || 'Dress code') + '" loading="lazy" />' +
          (label ? '<figcaption>' + label + '</figcaption>' : '');
        inspContainer.appendChild(fig);
      });
    }
  } else {
    var dressSection = document.getElementById('dress-code-section');
    if (dressSection) dressSection.style.display = 'none';
  }

  // --- Protocols / Panduan Tamu ---
  if (config.protocols && config.protocols.enabled) {
    if (config.protocols.title) setText('protocols-title', config.protocols.title);
    if (config.protocols.subtitle) setText('protocols-subtitle', config.protocols.subtitle);

    var tipsList = document.getElementById('guest-tips-list');
    var tips = config.protocols.guestTips || config.protocols.eventRules || [];
    if (tipsList && tips.length) {
      tipsList.innerHTML = '';
      tips.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = '<i class="bi bi-check-circle" aria-hidden="true"></i><span>' + item + '</span>';
        tipsList.appendChild(li);
      });
    }

    if (config.protocols.parkingInfo) {
      setText('parking-location', config.protocols.parkingInfo.location);
      setText('parking-capacity', config.protocols.parkingInfo.capacity);
      setText('valet-service', config.protocols.parkingInfo.valetService ? 'Tersedia' : 'Tidak tersedia');
    }
  } else {
    var protocolsSection = document.getElementById('protocols-section');
    if (protocolsSection) protocolsSection.style.display = 'none';
  }

  // --- Photo Bleed ---
  var photoBleed = document.querySelector('.photo-bleed');
  if (photoBleed) {
    photoBleed.style.display = hasPhotos ? '' : 'none';
    var bleedImg = photoBleed.querySelector('img');
    if (bleedImg && hasPhotos) {
      var bleedSrc = (config.gallery && config.gallery.images && config.gallery.images.landscape && config.gallery.images.landscape.length > 0)
        ? config.gallery.images.landscape[0]
        : (config.welcome && config.welcome.coverImage ? config.welcome.coverImage : './images/has_photos/final/gallery/landscape/1.webp');
      bleedImg.src = bleedSrc;
    }
  }

  // --- Love Story ---
  if (config.loveStory && config.loveStory.enabled) {
    var storyContainer = document.getElementById('love-story-container');
    if (storyContainer && config.loveStory.stories) {
      storyContainer.innerHTML = '';
      config.loveStory.stories.forEach(function (story, idx) {
        var isLast = idx === config.loveStory.stories.length - 1;
        var storyEl = document.createElement('div');
        storyEl.className = 'love-story-item' + (isLast ? ' love-story-item--last' : '');

        var timelineCol = document.createElement('div');
        timelineCol.className = 'love-story-rail';
        var railHtml = '';
        if (!isLast) {
          railHtml += '<span class="love-story-line" aria-hidden="true"></span>';
        }
        railHtml += '<span class="love-story-node" aria-hidden="true"><i class="bi bi-heart-fill"></i></span>';
        timelineCol.innerHTML = railHtml;

        var contentCol = document.createElement('div');
        contentCol.className = 'love-story-content';

        var contentHtml = '';
        if (hasPhotos && story.showImage && story.image) {
          contentHtml += '<div class="love-story-photo" data-aos="zoom-in" data-aos-duration="1000">';
          contentHtml += '<img src="' + story.image + '" loading="lazy" alt="kisah cinta ' + (idx + 1) + '" />';
          contentHtml += '</div>';
        }
        contentHtml += '<div class="love-story-text" data-aos="fade-left" data-aos-duration="1000">';
        if (story.year) {
          contentHtml += '<span class="love-story-year">' + story.year + '</span>';
        }
        contentHtml += '<h3 class="love-story-chapter">' + (story.title || '') + '</h3>';
        contentHtml += '<p class="love-story-desc">' + (story.description || '') + '</p>';
        contentHtml += '</div>';

        contentCol.innerHTML = contentHtml;
        storyEl.appendChild(timelineCol);
        storyEl.appendChild(contentCol);
        storyContainer.appendChild(storyEl);
      });
    }
  } else {
    var loveStorySection = document.getElementById('kisah-cinta-section');
    if (loveStorySection) loveStorySection.style.display = 'none';
  }

  // --- Gallery & Bottom Navbar Synchronization ---
  var gallerySection = document.getElementById('galeri-section');
  var galleryNavBtn = document.querySelector('.navbar-item[data-target="galeri-section"]');

  if (!hasPhotos || (config.gallery && config.gallery.enabled === false)) {
    if (gallerySection) gallerySection.style.display = 'none';
    if (galleryNavBtn) galleryNavBtn.style.display = 'none';
  } else {
    if (gallerySection) gallerySection.style.display = '';
    if (galleryNavBtn) galleryNavBtn.style.display = '';
    setText('gallery-title', (config.gallery && config.gallery.title) || 'Our Moment');
    var galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && config.gallery) {
      galleryGrid.innerHTML = '';

      // Bersihkan tombol "Lihat Semua Foto" lama jika ada
      var existingToggleWrap = document.getElementById('gallery-more-wrap');
      if (existingToggleWrap && existingToggleWrap.parentNode) {
        existingToggleWrap.parentNode.removeChild(existingToggleWrap);
      }

      var rawPortrait = (config.gallery.images && Array.isArray(config.gallery.images.portrait))
        ? config.gallery.images.portrait.slice()
        : [];
      var rawLandscape = (config.gallery.images && Array.isArray(config.gallery.images.landscape))
        ? config.gallery.images.landscape.slice()
        : [];

      // Fallback otomatis jika mode foto aktif tetapi array foto kosong
      if (rawPortrait.length === 0 && rawLandscape.length === 0) {
        rawPortrait = [
          './images/has_photos/final/gallery/portrait/1.webp',
          './images/has_photos/final/gallery/portrait/2.webp',
          './images/has_photos/final/gallery/portrait/3.webp',
          './images/has_photos/final/gallery/portrait/4.webp'
        ];
        rawLandscape = [
          './images/has_photos/final/gallery/landscape/1.webp',
          './images/has_photos/final/gallery/landscape/2.webp'
        ];
      }

      var allImages = [];

      // Skenario 1: Ada foto lanskap
      if (rawLandscape.length > 0) {
        // Lanskap pertama menjadi Hero lebar penuh (span 2, 4:3) di atas
        allImages.push({ src: rawLandscape[0], type: 'landscape-hero' });

        // Tambahkan foto potret
        // Jika jumlah potret ganjil dan > 0, jadikan potret terakhir (atau pertama jika cuma 1) sebagai 'featured' (span 2)
        // agar seluruh baris potret selalu genap berpasangan tanpa lubang kosong
        if (rawPortrait.length % 2 !== 0) {
          if (rawPortrait.length === 1) {
            allImages.push({ src: rawPortrait[0], type: 'portrait-featured' });
          } else {
            rawPortrait.slice(0, -1).forEach(function (img) {
              allImages.push({ src: img, type: 'portrait' });
            });
            allImages.push({ src: rawPortrait[rawPortrait.length - 1], type: 'portrait-featured' });
          }
        } else {
          // Jumlah potret genap: semuanya berpasangan rapi (span 1 masing-masing)
          rawPortrait.forEach(function (img) {
            allImages.push({ src: img, type: 'portrait' });
          });
        }

        // Tambahkan sisa foto lanskap (cinematic span 2, 16:9)
        rawLandscape.slice(1).forEach(function (img) {
          allImages.push({ src: img, type: 'landscape' });
        });
      } else {
        // Skenario 2: HANYA ada foto potret (tanpa lanskap)
        if (rawPortrait.length % 2 !== 0) {
          if (rawPortrait.length === 1) {
            allImages.push({ src: rawPortrait[0], type: 'portrait-featured' });
          } else {
            // Potret pertama sebagai 'featured' hero (span 2)
            // sisa potret genap dan tersusun rapi berpasangan
            allImages.push({ src: rawPortrait[0], type: 'portrait-featured' });
            rawPortrait.slice(1).forEach(function (img) {
              allImages.push({ src: img, type: 'portrait' });
            });
          }
        } else {
          // Jumlah genap
          rawPortrait.forEach(function (img) {
            allImages.push({ src: img, type: 'portrait' });
          });
        }
      }

      // Pengaturan limit tampilan awal
      var maxInitial = (typeof config.gallery.maxInitialDisplay === 'number' && config.gallery.maxInitialDisplay > 0)
        ? config.gallery.maxInitialDisplay
        : 6;

      // Target slot visual (selalu genap kelipatan 2 kolom agar baris selalu penuh tanpa ruang kosong)
      var targetSlots = (maxInitial % 2 === 0) ? maxInitial : (maxInitial + 1);

      // Hitung cutoff agar tampilan awal SELALU berakhir tepat pada baris yang penuh
      var currentSlots = 0;
      var effectiveInitialCount = 0;

      for (var i = 0; i < allImages.length; i++) {
        var span = (allImages[i].type === 'landscape-hero' || allImages[i].type === 'landscape' || allImages[i].type === 'portrait-featured') ? 2 : 1;
        if (currentSlots + span <= targetSlots) {
          currentSlots += span;
          effectiveInitialCount = i + 1;
        } else {
          break;
        }
      }

      // Validasi: pastikan baris terakhir benar-benar tertutup penuh (currentSlots genap)
      if (currentSlots % 2 !== 0 && effectiveInitialCount > 0) {
        effectiveInitialCount--;
      }

      // Edge case UX: Jika sisa foto yang tersembunyi hanya 0 atau 1 foto,
      // tampilkan semuanya langsung (tidak perlu tombol toggle hanya untuk 1 foto)
      if (allImages.length - effectiveInitialCount <= 1) {
        effectiveInitialCount = allImages.length;
      }

      // Render foto-foto ke DOM
      allImages.forEach(function (item, idx) {
        var div = document.createElement('div');
        var isHidden = idx >= effectiveInitialCount;

        var classList = ['gallery-item'];
        if (item.type === 'landscape-hero') {
          classList.push('gallery-item--hero');
        } else if (item.type === 'landscape') {
          classList.push('gallery-item--landscape');
        } else if (item.type === 'portrait-featured') {
          classList.push('gallery-item--featured');
        }

        if (isHidden) {
          classList.push('gallery-item--hidden');
        }

        div.className = classList.join(' ');
        div.setAttribute('data-index', idx);
        div.innerHTML = '<img src="' + item.src + '" alt="Momen ' + (idx + 1) + '" loading="lazy" width="400" height="500" onerror="this.closest(\'.gallery-item\').classList.add(\'gallery-item--broken\');" />';
        galleryGrid.appendChild(div);
      });

      // Buat tombol "Lihat Semua Foto" jika jumlah melebihi limit tampilan awal
      if (allImages.length > effectiveInitialCount) {
        var moreWrap = document.createElement('div');
        moreWrap.className = 'gallery-more-wrap';
        moreWrap.id = 'gallery-more-wrap';

        var toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'gallery-toggle-btn';
        toggleBtn.id = 'gallery-toggle-btn';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('data-total', allImages.length);
        toggleBtn.setAttribute('data-initial', effectiveInitialCount);
        toggleBtn.innerHTML = '<span class="btn-text">Lihat Semua Foto (' + allImages.length + ')</span> <i class="bi bi-chevron-down" aria-hidden="true"></i>';

        moreWrap.appendChild(toggleBtn);
        if (galleryGrid.parentNode) {
          galleryGrid.parentNode.appendChild(moreWrap);
        }
      }
    }
  }

  // ============================================================
  // Bank Logo Auto-Resolver Dictionary (35 Bank & E-Wallet)
  // ============================================================
  var BANK_LOGO_MAP = [
    { match: ['bca syariah', 'bca-syariah'], file: 'bca-syariah.png' },
    { match: ['bca digital', 'blu by bca', 'blu'], file: 'blu.png' },
    { match: ['bca', 'central asia'], file: 'bca.png' },
    { match: ['mandiri', 'livin'], file: 'mandiri.png' },
    { match: ['bsi', 'syariah indonesia', 'bank syariah'], file: 'bsi.png' },
    { match: ['bri', 'rakyat indonesia', 'brimo'], file: 'bri.png' },
    { match: ['bni', 'negara indonesia', 'wondr'], file: 'bni.png' },
    { match: ['btn', 'tabungan negara'], file: 'btn.png' },
    { match: ['cimb', 'niaga'], file: 'cimb.png' },
    { match: ['permata'], file: 'permata.png' },
    { match: ['danamon'], file: 'danamon.png' },
    { match: ['panin'], file: 'panin.png' },
    { match: ['mega'], file: 'mega.png' },
    { match: ['maybank'], file: 'maybank.png' },
    { match: ['ocbc', 'nisp'], file: 'ocbc.png' },
    { match: ['sinarmas'], file: 'sinarmas.png' },
    { match: ['uob', 'tmrw'], file: 'uob.png' },
    { match: ['muamalat'], file: 'muamalat.png' },
    { match: ['aladin'], file: 'aladin.png' },
    { match: ['jago'], file: 'jago.png' },
    { match: ['seabank', 'sea bank'], file: 'seabank.png' },
    { match: ['jenius', 'btpn'], file: 'jenius.png' },
    { match: ['allo'], file: 'allo.png' },
    { match: ['neobank', 'neo commerce', 'bank neo', 'bnc'], file: 'neobank.png' },
    { match: ['superbank', 'super bank'], file: 'superbank.png' },
    { match: ['line bank', 'linebank', 'hana bank', 'keb hana'], file: 'line-bank.png' },
    { match: ['bjb', 'jabar banten', 'bank jabar'], file: 'bjb.png' },
    { match: ['jateng', 'jawa tengah'], file: 'bank-jateng.png' },
    { match: ['jatim', 'jawa timur'], file: 'bank-jatim.png' },
    { match: ['dana'], file: 'dana.png' },
    { match: ['gopay', 'go-pay', 'gojek'], file: 'gopay.png' },
    { match: ['ovo'], file: 'ovo.png' },
    { match: ['shopeepay', 'shopee pay', 'spay'], file: 'shopeepay.png' },
    { match: ['linkaja', 'link aja'], file: 'linkaja.png' },
    { match: ['qris', 'qr code', 'qr'], file: 'qris.png' }
  ];

  /**
   * Menentukan path logo bank secara cerdas:
   * 1. Jika `customLogo` diisi kustom (bukan 'auto' / string kosong), pakai customLogo.
   * 2. Jika `customLogo` kosong / 'auto', deteksi otomatis berdasarkan nama `bankName`.
   */
  function resolveBankLogo(bankName, customLogo) {
    if (customLogo && typeof customLogo === 'string') {
      var trimmed = customLogo.trim();
      if (trimmed !== '' && trimmed.toLowerCase() !== 'auto') {
        if (trimmed.indexOf('/') !== -1 || trimmed.indexOf('.') !== -1) {
          return trimmed;
        }
        var lower = trimmed.toLowerCase();
        for (var i = 0; i < BANK_LOGO_MAP.length; i++) {
          if (BANK_LOGO_MAP[i].match.indexOf(lower) !== -1 || BANK_LOGO_MAP[i].file === lower + '.png') {
            return './images/logo/' + BANK_LOGO_MAP[i].file;
          }
        }
        return './images/logo/' + lower + '.png';
      }
    }

    if (!bankName || typeof bankName !== 'string') {
      return './images/logo/favicon.png';
    }

    var clean = bankName.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    for (var j = 0; j < BANK_LOGO_MAP.length; j++) {
      var matches = BANK_LOGO_MAP[j].match;
      for (var k = 0; k < matches.length; k++) {
        if (clean.indexOf(matches[k]) !== -1) {
          return './images/logo/' + BANK_LOGO_MAP[j].file;
        }
      }
    }

    return './images/logo/favicon.png';
  }
  window.resolveBankLogo = resolveBankLogo;

  // --- Gift ---
  if (config.gift && config.gift.enabled) {
    setText('gift-title', config.gift.title);
    setText('gift-description', config.gift.description);
    if (config.gift.bankAccounts) {
      var giftContentEl = document.getElementById('gift-content');
      var addressCardEl = giftContentEl ? giftContentEl.querySelector('.gift-address-card') : null;

      config.gift.bankAccounts.forEach(function (bank, idx) {
        var n = idx + 1;
        var bankCard = document.getElementById('bank-card-' + n);

        // Dukungan dinamis jika terdapat 3 atau lebih rekening bank
        if (!bankCard && giftContentEl && bank.enabled) {
          var templateCard = document.getElementById('bank-card-1');
          if (templateCard) {
            bankCard = templateCard.cloneNode(true);
            bankCard.id = 'bank-card-' + n;
            bankCard.setAttribute('data-od-id', 'bank-card-' + n);

            var logoImg = bankCard.querySelector('img');
            if (logoImg) logoImg.id = 'bank-logo-' + n;

            var bankNameEl = bankCard.querySelector('.gift-card-bank');
            if (bankNameEl) bankNameEl.id = 'bank-name-' + n;

            var accNameEl = bankCard.querySelector('.gift-card-name');
            if (accNameEl) accNameEl.id = 'account-name-' + n;

            var accNumEl = bankCard.querySelector('.gift-card-number-text');
            if (accNumEl) accNumEl.id = 'account-number-' + n;

            var notifEl = bankCard.querySelector('.copy-notif');
            if (notifEl) notifEl.id = 'notif-rekening-' + n;

            var copyBtn = bankCard.querySelector('.copy-btn');
            if (copyBtn) {
              copyBtn.setAttribute('data-target', 'account-number-' + n);
              copyBtn.setAttribute('data-notif', 'notif-rekening-' + n);
              copyBtn.setAttribute('aria-label', 'Salin nomor ' + (bank.bank || 'rekening'));
            }

            if (addressCardEl) {
              giftContentEl.insertBefore(bankCard, addressCardEl);
            } else {
              giftContentEl.appendChild(bankCard);
            }
          }
        }

        if (bank.enabled && bankCard) {
          bankCard.style.display = '';
          setText('bank-name-' + n, bank.bank);
          setText('account-name-' + n, bank.accountName);
          setText('account-number-' + n, bank.accountNumber);
          var logoEl = document.getElementById('bank-logo-' + n);
          var resolvedLogo = resolveBankLogo(bank.bank, bank.logo);
          if (logoEl && resolvedLogo) {
            logoEl.src = resolvedLogo;
            logoEl.alt = bank.bank || 'Bank Logo';
          }
        } else if (bankCard) {
          bankCard.style.display = 'none';
        }
      });
    }
    var addressCardEl = document.getElementById('gift-address-card') || (giftContentEl ? giftContentEl.querySelector('.gift-address-card') : null);
    var waGiftLinkEl = document.getElementById('wa-gift-link');

    if (config.gift.deliveryAddress && config.gift.deliveryAddress.enabled !== false) {
      if (addressCardEl) addressCardEl.style.display = '';
      if (waGiftLinkEl) waGiftLinkEl.style.display = '';

      if (config.gift.deliveryAddress.title) {
        var titleEl = document.getElementById('gift-address-title');
        if (titleEl) {
          titleEl.innerHTML = '<i class="bi bi-truck" aria-hidden="true"></i> ' + config.gift.deliveryAddress.title;
        }
      }
      setText('gift-recipient', config.gift.deliveryAddress.recipient);
      setText('gift-address', config.gift.deliveryAddress.address);
      setText('gift-phone', config.gift.deliveryAddress.phone);
      var giftWaPhone = config.gift.deliveryAddress.phone || (config.rsvp ? config.rsvp.whatsappNumber : '');
      if (giftWaPhone) {
        var cleanPhone = giftWaPhone.replace(/[^0-9]/g, '');
        var giftMsg = encodeURIComponent('Halo, saya ingin konfirmasi pengiriman hadiah untuk ' + coupleNames);
        setHref('wa-gift-link', 'https://wa.me/' + cleanPhone + '?text=' + giftMsg);
      }
    } else {
      if (addressCardEl) addressCardEl.style.display = 'none';
      if (waGiftLinkEl) waGiftLinkEl.style.display = 'none';
    }
  } else {
    var giftSection = document.getElementById('gift-section');
    if (giftSection) giftSection.style.display = 'none';
  }

  // --- RSVP ---
  if (config.rsvp && config.rsvp.enabled) {
    setText('rsvp-title', config.rsvp.title);
    setText('rsvp-description', config.rsvp.description);
    var waLink = document.getElementById('rsvp-whatsapp-link');
    if (waLink) {
      var waMsg = encodeURIComponent(config.rsvp.whatsappMessage || '');
      waLink.href = 'https://wa.me/' + (config.rsvp.whatsappNumber || '') + '?text=' + waMsg;
    }
    var noteEl = document.getElementById('rsvp-preview-note');
    if (noteEl) {
      if (!config.supabase || !config.supabase.enabled) {
        noteEl.textContent = config.rsvp.previewModeNote || 'Mode demo — pesan ditampilkan lokal.';
        noteEl.hidden = false;
      } else {
        noteEl.hidden = true;
      }
    }
  } else {
    var rsvpSection = document.getElementById('pesan-section');
    if (rsvpSection) rsvpSection.style.display = 'none';
  }

  // --- Thank You Section ---
  setText('thankyou-message', resolvePresetOrCustom(config.thankYou && config.thankYou.message, currentPreset.thankYouMessage, "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."));
  setText('thankyou-title', resolveText(config.thankYou && config.thankYou.title, 'Terima Kasih'));
  setText('thankyou-closing', resolvePresetOrCustom(config.thankYou && config.thankYou.closing, currentPreset.thankYouClosing, "Jazakumullah khairan katsiran"));
  var thankyouArab = document.getElementById('thankyou-arabic');
  if (thankyouArab) {
    thankyouArab.style.display = currentPreset.showArabic ? '' : 'none';
  }


  // --- Preloader initials ---
  if (config.preloader && config.preloader.showInitials) {
    var initials = '';
    var pName = (priaConfig && priaConfig.nickname) || '';
    var wName = (wanitaConfig && wanitaConfig.nickname) || '';
    if (pName) initials += pName.charAt(0);
    if (wName) initials += (initials ? ' & ' : '') + wName.charAt(0);
    setText('preloader-initials', initials || 'A & F');
  }

  // --- Music source ---
  if (config.music && config.music.file) {
    var audio = document.getElementById('background-music');
    if (audio) {
      var source = audio.querySelector('source');
      if (source) source.src = config.music.file;
      else audio.src = config.music.file;
    }
    if (config.music.enabled === false) {
      var musicCtrl = document.getElementById('music-controls');
      if (musicCtrl) musicCtrl.style.display = 'none';
    }
  }

  console.log('[config-loader] Config applied successfully for religion:', religion);
})();
