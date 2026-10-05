/* ============================================================
   Earthy Botanical — wedding-config.js
   BahagiaKita Wedding Invitation System
   Copyright (c) 2025–2026 Yusuf (BahagiaKita). All Rights Reserved.
   Licensed for BahagiaKita Client Deployments.
   13 section config, CJS pattern with browser fallback
   ============================================================ */

const weddingConfig = {

  // ============================================================
  // MASTER SWITCH: FOTO & AGAMA
  // ------------------------------------------------------------
  // hasPhotos : true (Ada Foto / Normal) | false (Mode Tanpa Foto)
  // religion  : 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'universal'
  // ============================================================
  hasPhotos: true,
  religion: 'islam',

  seo: {
    pageTitle: "The Wedding Of Ahmad & Fatimah — Earthy Botanical",
    metaDescription: "Undangan Pernikahan Ahmad & Fatimah. Senin, 15 Desember 2025. Bogor, Jawa Barat.",
    metaKeywords: "undangan pernikahan, wedding invitation, earthy botanical, wedding ceremony, ahmad fatimah",
    openGraph: {
      title: "The Wedding Of Ahmad & Fatimah",
      description: "Senin, 15 Desember 2025 — Bogor, Jawa Barat",
      image: "./images/has_photos/final/cover/cover.webp",
      url: "https://bahagiakita.my.id/earthy-botanical",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: "The Wedding Of Ahmad & Fatimah",
      description: "Senin, 15 Desember 2025 — Bogor, Jawa Barat",
      image: "./images/has_photos/final/cover/cover.webp"
    },
    favicon: "./images/logo/favicon.png"
  },

  pria: {
    fullName: "Ahmad Rizki Pratama",
    nickname: "Ahmad",
    childOrder: "Putra Pertama",
    parents: {
      father: "Bapak H. Sutrisno Pratama",
      mother: "Ibu Hj. Siti Aminah"
    },
    instagram: "@ahmad.rizki",
    instagramLink: "https://instagram.com/ahmad.rizki",
    photo: "./images/has_photos/final/profile/pria.webp"
  },

  wanita: {
    fullName: "Fatimah Az-Zahra",
    nickname: "Fatimah",
    childOrder: "Putri Kedua",
    parents: {
      father: "Bapak H. Abdullah Wahyudi",
      mother: "Ibu Hj. Khadijah Nuraini"
    },
    instagram: "@fatimah.azzahra",
    instagramLink: "https://instagram.com/fatimah.azzahra",
    photo: "./images/has_photos/final/profile/wanita.webp"
  },

  welcome: {
    weddingDate: "Senin, 15 Desember 2025",
    countdownDate: "2025-12-15T08:00:00+07:00",
    message: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.",
    coverImage: "./images/has_photos/final/cover/cover.webp",
    coverPosition: "center 22%",
    photoPosition: "center center",
    slideshowImages: [
      "./images/has_photos/final/gallery/portrait/1.webp",
      "./images/has_photos/final/gallery/portrait/2.webp",
      "./images/has_photos/final/gallery/portrait/3.webp",
      "./images/has_photos/final/gallery/portrait/4.webp",
      "./images/has_photos/final/gallery/portrait/5.webp"
    ]
  },

  doa: {
    enabled: true,
    ayat: {
      arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
      translation: "Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.",
      source: "Q.S Ar-Rum : 21"
    }
  },

  events: {
    akadNikah: {
      enabled: true,
      title: "Akad Nikah",
      day: "15",
      month: "Desember 2025",
      dayName: "Senin",
      time: "08:00 - 10:00 WIB",
      venue: "Masjid Al-Hijriyyah",
      address: "Jl. Raya Puncak No. 88, Cisarua, Bogor, Jawa Barat",
      mapsLink: "https://maps.google.com/?q=Masjid+Al-Hijriyyah+Bogor"
    },
    resepsi: {
      enabled: true,
      title: "Resepsi",
      day: "15",
      month: "Desember 2025",
      dayName: "Senin",
      time: "11:00 - 14:00 WIB",
      venue: "Botanical Garden Hall",
      address: "Jl. Raya Puncak No. 100, Cisarua, Bogor, Jawa Barat",
      mapsLink: "https://maps.google.com/?q=Botanical+Garden+Hall+Bogor"
    },
    liveStreaming: {
      enabled: false,
      title: "Live Streaming",
      description: "Untuk tamu yang tidak dapat hadir, bisa mengikuti acara secara online.",
      link: "https://youtube.com/watch?v=example",
      buttonText: "Tonton Live Streaming"
    }
  },

  dressCode: {
    enabled: false,
    theme: "Earthy Garden",
    colors: [
      { hex: "#7da268", name: "Sage" },
      { hex: "#c4876a", name: "Terracotta" },
      { hex: "#e8dcc8", name: "Cream" }
    ],
    recommendations: {
      men: "Kemeja sage green atau olive, celana bahan krem/beige.",
      women: "Dress floral earthy tones, atau kebaya sage/terracotta.",
      note: "Mohon hindari warna putih murni dan hitam. Palette: sage green, terracotta, cream."
    },
    inspirationImages: [
      { src: "./images/dresscode/men.svg", label: "Inspirasi Pria" },
      { src: "./images/dresscode/women.svg", label: "Inspirasi Wanita" }
    ]
  },

  protocols: {
    enabled: false,
    title: "Panduan Tamu",
    subtitle: "Agar acara berjalan nyaman bersama",
    guestTips: [
      "Hadir 15 menit sebelum acara dimulai.",
      "Pakaian sesuai dress code yang telah ditentukan.",
      "Matikan atau silent ponsel selama prosesi acara berlangsung.",
      "Dilarang membawa makanan/minuman dari luar.",
      "Jika merasa kurang sehat, mohon menonton via live streaming."
    ],
    parkingInfo: {
      available: true,
      location: "Area parkir tersedia di samping venue.",
      capacity: "100 kendaraan roda 4, 50 roda 2",
      valetService: true
    }
  },

  loveStory: {
    enabled: true,
    stories: [
      {
        showImage: true,
        image: "./images/has_photos/final/gallery/landscape/2.webp",
        year: "2023",
        title: "Awal Pertemuan Sederhana",
        description: "Berawal dari tempat pekerjaan Cianjur-2023, kami mengenal satu sama lain dan belum ada benih cinta kala itu, hanya sebatas teman kerja."
      },
      {
        showImage: true,
        image: "./images/has_photos/final/gallery/landscape/3.webp",
        year: "2024",
        title: "Benih Cinta dalam Ujian",
        description: "Setelah cukup mengenal satu sama lain, satu tahun kurang lebih nya kami menjalin hubungan. Akhirnya kita memutuskan untuk melanjutkan ke Hubungan yang lebih serius mempertemukan kedua keluarga."
      },
      {
        showImage: true,
        image: "./images/has_photos/final/gallery/landscape/1.webp",
        year: "2025",
        title: "Langkah Menuju Janji Suci",
        description: "Sampai pada hari yang penuh kebahagiaan ini, kami mengikat janji suci dan melangkah bersama sebagai pasangan suami istri dalam ikatan cinta yang abadi."
      }
    ]
  },

  gallery: {
    enabled: true,
    title: "Our Moment",
    // Jumlah foto awal yang langsung terlihat di grid (default: 6).
    // Jika jumlah foto melebihi angka ini, tombol "Lihat Semua Foto" akan muncul secara otomatis.
    maxInitialDisplay: 6,
    showYoutubeVideo: false,
    youtubeVideo: "",
    images: {
      portrait: [
        "./images/has_photos/final/gallery/portrait/1.webp",
        "./images/has_photos/final/gallery/portrait/2.webp",
        "./images/has_photos/final/gallery/portrait/3.webp",
        "./images/has_photos/final/gallery/portrait/4.webp",
        "./images/has_photos/final/gallery/portrait/5.webp",
        "./images/has_photos/final/gallery/portrait/6.webp",
        "./images/has_photos/final/gallery/portrait/7.webp",
        "./images/has_photos/final/gallery/portrait/8.webp",
        "./images/has_photos/final/gallery/portrait/9.webp",
        "./images/has_photos/final/gallery/portrait/10.webp",
        "./images/has_photos/final/gallery/portrait/11.webp",
        "./images/has_photos/final/gallery/portrait/12.webp",
        "./images/has_photos/final/gallery/portrait/13.webp",
        "./images/has_photos/final/gallery/portrait/14.webp",
        "./images/has_photos/final/gallery/portrait/15.webp",
        "./images/has_photos/final/gallery/portrait/16.webp",
        "./images/has_photos/final/gallery/portrait/17.webp",
        "./images/has_photos/final/gallery/portrait/18.webp",
        "./images/has_photos/final/gallery/portrait/19.webp",
        "./images/has_photos/final/gallery/portrait/20.webp",
        "./images/has_photos/final/gallery/portrait/21.webp",
        "./images/has_photos/final/gallery/portrait/22.webp",
        "./images/has_photos/final/gallery/portrait/23.webp",
        "./images/has_photos/final/gallery/portrait/24.webp"
      ],
      landscape: [
        "./images/has_photos/final/gallery/landscape/1.webp",
        "./images/has_photos/final/gallery/landscape/2.webp",
        "./images/has_photos/final/gallery/landscape/3.webp"
      ]
    }
  },

  gift: {
    enabled: true,
    title: "Wedding Gift",
    description: "Doa restu Anda adalah hadiah terindah. Namun jika ingin memberikan tanda kasih, kami sediakan opsi di bawah ini.",
    // ============================================================
    // Logo Bank & E-Wallet Otomatis atau Kustom:
    // 1. OTOMATIS: Cukup ubah `bank` (contoh: "Mandiri", "BCA", "BSI", "BRI", "Dana", "GoPay", "QRIS", dll).
    //              Logo di bawah otomatis berubah ke file logo yang pas tanpa perlu ketik path!
    // 2. KUSTOM  : Jika ingin logo khusus / QR sendiri, isi `logo` dengan path file (contoh: "./images/custom/my-qr.png").
    // - Pilihan 35 bank & e-wallet lengkap dapat dilihat di: images/logo/sample/preview.html
    // ============================================================
    bankAccounts: [
      {
        enabled: true,
        bank: "BCA",
        accountName: "Ahmad Rizki Pratama",
        accountNumber: "1234567890",
        logo: "auto" // Otomatis menggunakan ./images/logo/bca.png
      },
      {
        enabled: true,
        bank: "Mandiri",
        accountName: "Fatimah Az-Zahra",
        accountNumber: "1370012345678",
        logo: "auto" // Otomatis menggunakan ./images/logo/mandiri.png
      }
    ],
    deliveryAddress: {
      enabled: false, // Ubah ke false jika hanya ingin menampilkan rekening transfer (menyembunyikan alamat & tombol WA)
      title: "Kirim Hadiah",
      recipient: "Ahmad Rizki Pratama",
      address: "Jl. Melati No. 12, Cisarua, Bogor, Jawa Barat 16750",
      phone: "081234567890"
    }
  },

  rsvp: {
    enabled: true,
    title: "Ucapan & Doa",
    description: "Kirimkan ucapan dan doa terbaik Anda untuk kedua mempelai.",
    whatsappNumber: "6281234567890",
    whatsappMessage: "Halo, saya akan hadir di pernikahan Ahmad & Fatimah.",
    formEndpoint: "",
    previewModeNote: "Mode demo — pesan ditampilkan lokal (belum tersimpan ke server)."
  },

  supabase: {
    enabled: true,
    url: "https://btxznwjdpirejzqbeabp.supabase.co",
    anonKey: "sb_publishable_kEhoB8vBm2C2P9nP1F4hJw_eVqcUYq9",
    tableName: "template1"
  },

  thankYou: {
    title: "Terima Kasih",
    message: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    closing: "Jazakumullah khairan katsiran"
  },

  music: {
    file: "./music/song.mp3",
    autoplay: true,
    enabled: true
  },

  preloader: {
    enabled: true,
    minimumDisplayTime: 1500,
    showProgress: true,
    showInitials: false
  },

  socialMedia: {
    instagram: {
      male: "https://instagram.com/ahmad.rizki",
      female: "https://instagram.com/fatimah.azzahra"
    }
  }

};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = weddingConfig;
}
if (typeof window !== 'undefined') {
  window.weddingConfig = weddingConfig;
}
