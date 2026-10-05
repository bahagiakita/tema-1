# 📸 PANDUAN DROPZONE FOTO MENTAH (RAW PHOTOS)

Folder ini adalah tempat memasukkan foto mentah dari klien (format bebas: **JPG, PNG, WebP, maupun file kamera iPhone HEIC/HEIF**).

Semua hasil konversi otomatis masuk ke **`images/has_photos/final/`** dan langsung mengaktifkan `hasPhotos: true` di **`wedding-config.js`**.

---

## 📋 Tabel Contekan Cepat (Aturan Folder & Nama File)

| Folder Target | Contoh Nama File | Aturan Penamaan | Fungsi & Output |
| :--- | :--- | :--- | :--- |
| **`raw/couple/`** | `prewed.jpg`, `IMG_001.heic`, `foto.png` | **BEBAS 100%** | Dipecah jadi **3 aset**: Cover Atas, Profil Pria (700x700), Profil Wanita (700x700). |
| **`raw/profile/`** | `pria.jpg`, `foto-pria.heic`<br>`wanita.jpg`, `mempelai-wanita.png` | Wajib ada kata **`pria`** dan **`wanita`** | Dipotong presisi bulat 1:1 (`700x700 px`) dengan Smart Face Crop. |
| **`raw/cover/`** | `sampul.jpg`, `hero.heic`, `bg.png` | **BEBAS 100%** | Di-resize untuk background cover atas (`800x1200 px`). |
| **`raw/gallery/`** | `1.jpg`, `moment.heic`, `foto.png`, dst. | **BEBAS 100%** | Disimpan 100% utuh tanpa crop. Otomatis dipisah ke `portrait/` & `landscape/`. |

---

## 👩‍❤️‍👨 SKENARIO 1: Klien HANYA Mengirim 1 Foto Berdua (Couple)

Masukkan 1 foto berdua ke folder:
```text
images/has_photos/raw/couple/foto-berdua.jpg
```

Pilih salah satu cara berikut:

### Opsi A (Paling Direkomendasikan): Visual Cropper GUI
```bash
npm run couple:crop
```
*(Atau double-click file bash: `crop-couple-photo.sh`)*
* Layar browser lokal otomatis terbuka (`http://localhost:5566`).
* Ada 2 lingkaran interaktif: **Mempelai Pria (Biru)** dan **Mempelai Wanita (Pink)**.
* Geser lingkaran ke wajah masing-masing (ada slider zoom & live preview bulat).
* Klik **"Simpan & Terapkan"** $\rightarrow$ Selesai dalam 2 detik dengan akurasi 100%!

### Opsi B: Konversi Otomatis CLI
```bash
npm run couple:convert
```
*(Atau double-click file bash: `convert-couple-photo.sh`)*
* **Trik Cerdas Posisi:**
  * Secara default: **Pria di Kiri, Wanita di Kanan**.
  * Jika wanita di kiri, cukup beri nama file mengandung kata `wanita-kiri` (misal: `foto-wanita-kiri.jpg`), atau jalankan perintah:
    ```bash
    npm run couple:convert -- --swap
    ```

---

## 🎯 SKENARIO 2: Klien Mengirim Banyak Foto (Profil + Galeri Terpisah)

Masukkan foto ke subfolder masing-masing:
```text
images/has_photos/raw/
├── profile/   <-- pria.* dan wanita.* (wajib ada kata pria/wanita di nama filenya)
├── cover/     <-- cover.* (bebas nama file)
└── gallery/   <-- Bebas campur foto potret & lanskap (bebas nama file)
```

Lalu jalankan perintah sekali klik:
```bash
npm run photos:convert
```
*(Atau double-click file bash: `convert-photos.sh`)*

* Foto galeri lama otomatis dicadangkan ke `.backup/`.
* Foto potret otomatis masuk ke `final/gallery/portrait/1.webp`, `2.webp`, dst.
* Foto lanskap otomatis masuk ke `final/gallery/landscape/1.webp`, `2.webp`, dst.
* Daftar foto di `wedding-config.js` otomatis sinkron.

---

## 💡 Mode Santai (Flat / Tanpa Subfolder)

Jika sedang terburu-buru dan tidak ingin membuat subfolder, Anda bisa menaruh seluruh file langsung di folder `images/has_photos/raw/`:
* File dengan kata `pria` $\rightarrow$ Profil pria
* File dengan kata `wanita` $\rightarrow$ Profil wanita
* File dengan kata `cover` atau `couple` $\rightarrow$ Cover / couple
* Sisanya $\rightarrow$ Otomatis masuk galeri!

---

> ⚠️ **Catatan Penting Setelah Konversi:**
> Selalu tekan **`Ctrl + Shift + R`** (Hard Reload) pada browser Anda agar browser langsung memuat foto-foto WebP baru tanpa tertahan cache lama.
