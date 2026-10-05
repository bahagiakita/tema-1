# 🕊️ Panduan Sistem Multi-Agama & Mode Tanpa Foto

Template **Earthy Botanical** memiliki sistem sakral multi-agama terintegrasi yang mendukung 6 kategori keyakinan: **Islam, Kristen, Katolik, Hindu, Buddha, dan Universal/Netral**.

Cukup dengan mengubah **1 parameter `religion`** di `wedding-config.js`, seluruh narasi, salam, judul prosesi, ayat/kutipan suci, hingga ilustrasi visual akan otomatis beradaptasi tanpa perlu mengetik ulang dari awal.

---

## 1. Parameter Konfigurasi

Buka file `wedding-config.js` di baris atas:

```javascript
const weddingConfig = {
  // MASTER SWITCH
  hasPhotos: true,     // true (Pakai Foto Asli) | false (Mode Tanpa Foto / Siluet)
  religion: 'islam',   // Pilihan: 'islam' | 'kristen' | 'katolik' | 'hindu' | 'buddha' | 'universal'
  ...
};
```

---

## 2. Matriks Lengkap Preset 6 Agama

Tabel berikut menunjukkan teks bawaan (*preset*) yang otomatis aktif untuk masing-masing agama:

| Parameter | 1. Islam (`'islam'`) | 2. Kristen (`'kristen'`) | 3. Katolik (`'katolik'`) | 4. Hindu (`'hindu'`) | 5. Buddha (`'buddha'`) | 6. Universal (`'universal'`) |
|---|---|---|---|---|---|---|
| **Salam Pembuka** | *"Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud..."* | *"Dengan kasih karunia dan damai sejahtera dari Tuhan Yesus Kristus..."* | *"Atas berkat dan kasih karunia Allah Bapa melalui Yesus Kristus..."* | *"Om Swastyastu, atas asung kerta wara nugraha Ida Sang Hyang Widhi Wasa..."* | *"Namo Buddhaya, terpujilah Sang Tiratana, dengan penuh sukacita..."* | *"Dengan penuh rasa syukur dan kebahagiaan yang mendalam..."* |
| **Judul Seksi Doa** | Doa & Ayat Suci | Ayat Kasih | Firman Pernikahan | Sloka Suci Weda | Paritta Pernikahan | Kutipan Cinta |
| **Kutipan Kitab / Quote** | **Q.S. Ar-Rum : 21** | **1 Korintus 13:4-7** | **Matius 19:6** | **Rgveda X.85.42** | **Mangala Sutta** | **Kahlil Gibran / Quote** |
| **Lafadz Kaligrafi Arab** | **Ditampilkan** | **Disembunyikan Otomatis** | **Disembunyikan Otomatis** | **Disembunyikan Otomatis** | **Disembunyikan Otomatis** | **Disembunyikan Otomatis** |
| **Nama Acara Utama (Acara 1)** | **Akad Nikah** | **Pemberkatan Nikah** | **Sakramen Pernikahan** | **Upacara Pawiwahan** | **Pemberkahan Nikah** | **Janji Suci / Resepsi** |
| **Penutup & Berkat** | *"Jazakumullah khairan katsiran"* | *"Tuhan Yesus Memberkati"* | *"Berkah Dalem & Kasih Kristus"* | *"Om Shanti, Shanti, Shanti, Om"* | *"Sabbe Satta Bhavantu Sukhitatta"* | *"Salam Hangat & Penuh Kasih"* |

---

## 3. Aturan Aset Visual (Mode Tanpa Foto: `hasPhotos: false`)

Saat klien tidak ingin menampilkan foto wajah aslinya (`hasPhotos: false`), template secara otomatis memetakan visual ke 2 set ilustrasi:

```text
images/no_photos/
├── islamic/                    # Khusus Islam
│   ├── profile/
│   │   ├── pria.webp           # Pria formal jas/peci
│   │   └── wanita.webp         # Wanita berhijab anggun
│   ├── welcome/
│   │   └── main.webp           # Pasangan siluet busana muslim
│   ├── cover/
│   │   └── cover.webp          # Latar cover estetik botanical islami
│   └── seo/
│       └── og-image.jpg        # Pratinjau share WA
│
└── universal/                  # Kristen, Katolik, Hindu, Buddha, Universal
    ├── profile/
    │   ├── pria.webp           # Pria jas modern / tuxedo tanpa peci
    │   └── wanita.webp         # Wanita gaun pengantin TANPA HIJAB
    ├── welcome/
    │   └── main.webp           # Pasangan gaun pengantin modern
    ├── cover/
    │   └── cover.webp          # Latar cover botanical elegan netral
    └── seo/
        └── og-image.jpg        # Pratinjau share WA modern
```

### Logika Pemilihan Aset:
- Jika `religion === 'islam'` ➔ Menggunakan `images/no_photos/islamic/`
- Jika `religion !== 'islam'` ➔ Otomatis menggunakan `images/no_photos/universal/`

---

## 4. Kustomisasi Manual (Override)

Preset bawaan di atas berfungsi sebagai default cerdas. Jika klien memiliki ayat atau kalimat khusus sendiri, Anda tetap bisa menimpanya langsung di `wedding-config.js`:

```javascript
// Contoh: Mengganti ayat suci Kristen dengan kutipan pilihan klien
doa: {
  enabled: true,
  ayat: {
    translation: "Demikianlah mereka bukan lagi dua, melainkan satu...",
    source: "Matius 19:6"
  }
}
```
*Jika kolom di atas diisi manual, template akan memprioritaskan teks manual tersebut dibanding preset bawaan.*
