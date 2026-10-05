# 🌿 Earthy Botanical — Wedding Invitation Template (BahagiaKita)

Template undangan pernikahan digital modern, elegan, dan ultra-ringan berbasis **HTML5, Tailwind CSS v4, dan Vanilla JavaScript**. Dilengkapi dengan otomatisasi pemrosesan foto, sistem tree-shaking aset pintar untuk produksi, proteksi master template (*Safety Vault*), dan kompatibel penuh dengan **GitHub Pages**.

---

## 📑 Daftar Isi
- [1. Arsitektur Folder & Gambar](#1-arsitektur-folder--gambar)
- [2. Alur Pengolahan Foto Klien](#2-alur-pengolahan-foto-klien)
  - [Kasus A: Foto Profil Terpisah](#kasus-a-foto-profil-terpisah-pria--wanita)
  - [Kasus B: Membelah Foto Berdua (Couple Split)](#kasus-b-membelah-foto-berdua-couple-split)
  - [Kasus C: Foto Cover & Galeri](#kasus-c-foto-cover--galeri)
- [3. Finalisasi Produksi & Minifikasi (Tree-Shaking)](#3-finalisasi-produksi--minifikasi-tree-shaking)
- [4. Master Template Safety Vault & Restore](#4-master-template-safety-vault--restore)
- [5. Panduan Deployment ke GitHub Pages](#5-panduan-deployment-ke-github-pages)
- [6. Cheat Sheet Perintah (NPM & Shell Script)](#6-cheat-sheet-perintah-npm--shell-script)

---

## 1. Arsitektur Folder & Gambar

Seluruh aset gambar dikelompokkan secara rapi di dalam direktori `images/`:

```text
images/
├── dresscode/               # Ilustrasi pakaian pria & wanita (.svg)
├── furnitur/                # Ornamen dekorasi UI, bunga sudut (wave), dan frame lingkaran
├── logo/                    # 35+ Logo Bank, E-Wallet, QRIS & favicon.png
│   └── sample/              # Pratinjau katalog logo (hanya untuk referensi dev)
├── no_photos/               # Aset ilustrasi siluet jika klien memilih mode tanpa foto
│   ├── islamic/             # Siluet busana muslim & ornamen islami
│   └── universal/           # Siluet busana jas/gaun universal
└── has_photos/              # Direktori kerja foto asli klien
    ├── raw/                 # INPUT: Foto mentah resolusi tinggi dari klien (diabaikan git)
    │   ├── profile/         # Foto individu pria/wanita
    │   ├── couple/          # Foto berdua untuk di-split/crop
    │   ├── cover/           # Foto cover/background utama
    │   └── gallery/         # Foto album potret & lanskap
    └── final/               # OUTPUT: Foto web-ready (.webp) terkompresi optimal
        ├── profile/         # pria.webp (1:1, 600x600), wanita.webp (1:1, 600x600)
        ├── cover/           # cover.webp (1080x1920)
        └── gallery/         # portrait/ & landscape/
```

---

## 2. Alur Pengolahan Foto Klien

Tidak perlu memotong atau mengompres foto secara manual menggunakan Photoshop. Tersedia skrip otomatis berbasis **Sharp**:

### Kasus A: Foto Profil Terpisah (Pria & Wanita)
1. Masukkan foto pria ke `images/has_photos/raw/profile/` (nama file bebas atau `pria.jpg`).
2. Masukkan foto wanita ke `images/has_photos/raw/profile/` (nama file bebas atau `wanita.jpg`).
3. Jalankan pengonversi:
   ```bash
   npm run photos:convert
   # atau klik ganda: ./convert-photos.sh
   ```
   *Output otomatis disimpan ke `images/has_photos/final/profile/pria.webp` dan `wanita.webp` (600x600 px, rasio 1:1).*

---

### Kasus B: Membelah Foto Berdua (Couple Split)
Bila klien hanya mengirimkan 1 foto berdua (misal hasil prewedding):
1. Masukkan foto berdua ke folder `images/has_photos/raw/couple/`.

**Opsi 1: Visual Web Cropper (Sangat Direkomendasikan)**
Buka antarmuka visual interaktif berbasis browser untuk mengatur framing wajah secara presisi:
```bash
npm run couple:crop
# atau klik ganda: ./crop-couple-photo.sh
```
- Menampilkan dua frame lingkaran (Pria & Wanita) secara berdampingan.
- Mendukung fitur **Zoom Slider**, **Drag / Geser Frame**, dan tombol **Tukar Posisi (Swap)** jika posisi pria berada di sebelah kanan.
- Klik **"Potong & Simpan Foto"** untuk langsung mengekspor kedua foto ke `images/has_photos/final/profile/`.

**Opsi 2: CLI Splitter Otomatis**
```bash
npm run couple:convert
# atau klik ganda: ./convert-couple-photo.sh
```
- Otomatis membagi foto menjadi sisi kiri dan kanan dengan auto-crop ke wajah.
- Tambahkan flag `--swap` jika posisi pria berada di kanan:
  ```bash
  npm run couple:convert -- --swap
  ```

---

### Kasus C: Foto Cover & Galeri
1. Masukkan foto cover ke `images/has_photos/raw/cover/` (format apa pun).
2. Masukkan foto album ke `images/has_photos/raw/gallery/`.
3. Jalankan:
   ```bash
   npm run photos:convert
   ```
   - Foto cover dikonversi menjadi `images/has_photos/final/cover/cover.webp` (1080x1920).
   - Foto galeri otomatis dideteksi orientasinya: foto vertikal masuk ke `gallery/portrait/`, foto horizontal masuk ke `gallery/landscape/`.

---

## 3. Finalisasi Produksi & Minifikasi (Tree-Shaking)

Ketika undangan sudah selesai dikonfigurasi di `wedding-config.js` dan siap dipublikasikan ke klien/hosting:

```bash
npm run finalize
# atau klik ganda: ./finalize-invitation.sh
```

### Apa Saja yang Dilakukan Skrip Finalisasi?
1. **Proteksi Master Vault**: Mengamankan semua aset master (35+ logo bank, semua varian agama) ke folder `.template-vault/` sebelum pemangkasan.
2. **Minifikasi Tailwind CSS**: Menjalankan Tailwind CLI dengan flag `--minify` pada `css/output.css` (menghemat ~24% bobot CSS).
3. **Tree-Shaking Logo Bank**: 
   - Membaca `gift.bankAccounts` di `wedding-config.js` dan tag di `index.html`.
   - Hanya mempertahankan logo bank yang benar-benar aktif (misal BCA dan Mandiri) + `favicon.png`.
   - Memangkas 33+ logo bank lainnya dan menghapus folder katalog `images/logo/sample/` (menghemat ~750 KB).
4. **Penyesuaian Aset Agama**:
   - Jika `religion: 'islam'`, folder `images/no_photos/universal/` dipangkas.
   - Jika `religion` non-islam, folder `images/no_photos/islamic/` dipangkas.
5. **Tree-Shaking Galeri**:
   - Memeriksa daftar foto di `weddingConfig.gallery.images` dan `weddingConfig.loveStory`.
   - Foto galeri di `final/` yang tidak terdaftar di konfigurasi otomatis diarsipkan ke vault dan dibersihkan dari build.
6. **Pembersihan File Raw & Sampah**:
   - Memindahkan foto raw klien ke `.template-vault/raw-archive/` agar folder kerja bersih.
   - Menghapus folder backup lama (`images/has_photos_bak/`) dan file sampah (`*.bak`, `*.tmp`).

> **Hasil:** Ukuran total repositori berkurang drastis hingga **~2.1 MB**, membuat undangan sangat cepat dibuka oleh tamu undangan bahkan dengan koneksi seluler lambat.

---

## 4. Master Template Safety Vault & Restore

Sistem finalisasi ini **100% Non-Destruktif**! Anda tidak akan pernah kehilangan aset master template.

### Lokasi Vault: `.template-vault/`
- Folder ini otomatis dibuat saat perintah `finalize` pertama kali dijalankan.
- Menyimpan salinan lengkap:
  - Seluruh 35 logo bank & e-wallet + folder sampel demo.
  - Seluruh varian ilustrasi agama (`islamic` & `universal`).
  - Arsip foto raw dan foto galeri yang dipangkas.
- Folder `.template-vault/` sudah diatur dalam `.gitignore`, sehingga **TIDAK AKAN PERNAH** ter-upload ke GitHub Pages / repositori publik.

### Cara Mereset Template untuk Klien Berikutnya
Setelah proyek klien selesai dan Anda ingin membuat undangan baru dari template awal:

```bash
npm run template:restore
# atau klik ganda: ./restore-template.sh
```

Skrip ini akan:
1. Mengembalikan seluruh 35 logo bank dan folder `sample/`.
2. Mengembalikan semua varian agama (`islamic` & `universal`).
3. Me-rebuild Tailwind CSS ke mode normal development.
4. Menyiapkan template kembali ke kondisi bersih seperti baru.

---

## 5. Panduan Deployment ke GitHub Pages

File [`.gitignore`](.gitignore) telah disiapkan khusus untuk keamanan dan performa GitHub Pages:

### File Khusus GitHub Pages:
- `.nojekyll` (Memastikan GitHub Pages tidak memproses Jekyll sehingga loading aset statis lebih cepat dan file tidak terlewat).
- `404.html` (Halaman ramah tamu jika salah membuka URL dengan tombol kembali ke undangan).
- `.gitignore` (Mencegah `.template-vault/`, foto mentah berukuran besar, dan file backup ter-upload).

### File yang Diabaikan Git:
- `.template-vault/` (Master archive lokal tetap aman di laptop pengembang).
- `images/has_photos/raw/**/*` (Foto mentah klien berukuran puluhan MB tidak bocor/di-upload ke git).
- `node_modules/`, `*.bak`, file sampah OS.

### Langkah Deploy Pertama Kali:
```bash
# 1. Pastikan undangan sudah final dan ter-minify
npm run finalize

# 2. Inisialisasi git (jika belum)
git init
git add .
git commit -m "feat: release production wedding invitation"

# 3. Hubungkan ke repositori GitHub
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

### Konfigurasi di GitHub:
1. Masuk ke halaman repositori di GitHub.
2. Buka menu **Settings** > **Pages**.
3. Pada bagian **Build and deployment**:
   - **Source**: Pilih `Deploy from a branch`.
   - **Branch**: Pilih `main` (atau `gh-pages`) dan folder `/ (root)`.
4. Klik **Save**. Undangan Anda akan aktif dalam 1-2 menit di URL:
   `https://USERNAME.github.io/NAMA-REPO/`

---

## 6. Cheat Sheet Perintah (NPM & Shell Script)

| Tujuan / Fungsi | Perintah NPM | Launcher Shell (.sh) |
| :--- | :--- | :--- |
| **Jalankan Server Lokal & Watch CSS** | `npm start` | - |
| **Kompilasi Tailwind CSS (Dev)** | `npm run dev` | - |
| **Jalankan Local Web Server** | `npm run serve` | - |
| **Crop Foto Berdua (Visual GUI)** | `npm run couple:crop` | `./crop-couple-photo.sh` |
| **Split Foto Berdua (CLI Cepat)** | `npm run couple:convert` | `./convert-couple-photo.sh` |
| **Konversi Foto Cover & Galeri** | `npm run photos:convert` | `./convert-photos.sh` |
| **Finalisasi & Minifikasi Produksi** | `npm run finalize` | `./finalize-invitation.sh` |
| **Reset Template ke Kondisi Master** | `npm run template:restore` | `./restore-template.sh` |

---

*Dikembangkan dengan ❤️ untuk BahagiaKita Wedding Invitation System.*
