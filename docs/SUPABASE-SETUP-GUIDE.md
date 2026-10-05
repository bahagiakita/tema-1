# Panduan Integrasi Supabase — RSVP & Chat Ucapan Doa
> **Dokumen Panduan Setup & Teknis**  
> **Target Modul**: `templates/template-1` (Earthy Botanical Theme)  
> **Komponen**: Seksi Pesan & RSVP (`#pesan-section`), `js/supabase_config.js`, `js/script_form.js`  
> **Status**: Ready for Production  

---

## 1. Ringkasan Arsitektur & Alur Kerja

Sistem chat ucapan & RSVP pada template ini dibangun dengan arsitektur **Client-Side Direct to Supabase** memanfaatkan `@supabase/supabase-js` tanpa memerlukan backend server Node.js/PHP terpisah.

```
[ Tamu / Pengunjung ]
        │ (1. Isi Form Nama, Kehadiran, Pesan)
        ▼
[ index.html & script_form.js ]
        │ (2. Validasi Form & Cek Supabase Client)
        ├─── Jika Supabase Aktif ──────► [ Supabase REST API ]
        │                                        │
        │                                        ▼
        │                               [ PostgreSQL Database ]
        │                                 - RLS Security Check
        │                                 - Anti-Spam Trigger
        │                                        │
        │ (4. Broadcast Realtime) ◄──────────────┴─ [ Realtime Engine ]
        ▼
[ Update UI Otomatis di Layar Seluruh Tamu ]
```

### Komponen Kunci di Template:
1. **[`wedding-config.js`](../wedding-config.js)**: Menyimpan kredensial `url`, `anonKey`, dan konfigurasi master `supabase.enabled`.
2. **[`js/supabase_config.js`](../js/supabase_config.js)**: Menginisialisasi `window.supabaseClient` jika `supabase.enabled = true`.
3. **[`js/script_form.js`](../js/script_form.js)**: Mengontrol form submit, pagination (*load more*), sanitasi teks (XSS prevention), dan render list pesan.
4. **[`js/user-identifier.js`](../js/user-identifier.js)**: Mengambil nama dari URL `?to=Nama+Tamu` dan membuat identifier unik `userId` per perangkat tamu.

---

## 2. Langkah 1: Buat Proyek di Supabase Dashboard

1. Kunjungi [supabase.com](https://supabase.com) dan masuk ke akun Anda.
2. Klik tombol **New Project**.
3. Isi formulir pembuatan proyek:
   - **Name**: `wedding-earthy-botanical` (atau sesuaikan dengan nama klien).
   - **Database Password**: Buat password yang kuat dan simpan di tempat aman.
   - **Region**: Pilih **`Singapore (ap-southeast-1)`** untuk performa latensi tercepat bagi pengguna di Indonesia.
   - **Pricing Plan**: Pilih **Free Plan** (Free tier Supabase mencakup 500MB DB & 50.000 Monthly Active Users, sangat cukup untuk undangan pernikahan).
4. Klik **Create new project** dan tunggu proses inisialisasi (~1–2 menit).

---

## 3. Langkah 2: Eksekusi SQL Migration (Skema & Keamanan)

Buka menu **SQL Editor** (ikon terminal `>_` di sidebar kiri Supabase), klik **New Query**, lalu salin dan jalankan (*Run*) seluruh script SQL berikut:

```sql
-- ============================================================
-- 1. TABEL UTAMA: rsvp_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rsvp_messages (
    id BIGSERIAL PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    attendance VARCHAR(20) NOT NULL DEFAULT 'hadir', -- 'hadir' atau 'tidak_hadir'
    message TEXT,
    user_id VARCHAR(100) DEFAULT 'anonymous',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index untuk mempercepat query sorting pesan terbaru
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON public.rsvp_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvp_user_id ON public.rsvp_messages (user_id);

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS) - STANDAR UNDANGAN DIGITAL
-- ============================================================
ALTER TABLE public.rsvp_messages ENABLE ROW LEVEL SECURITY;

-- A. Policy: Semua tamu dapat membaca pesan ucapan
CREATE POLICY "Allow public read"
ON public.rsvp_messages
FOR SELECT
TO anon, authenticated
USING (true);

-- B. Policy: Semua tamu dapat mengirim ucapan baru
CREATE POLICY "Allow public insert"
ON public.rsvp_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- C. Policy: Tamu dapat mengedit/memperbarui pesan miliknya sendiri
CREATE POLICY "Allow public update"
ON public.rsvp_messages
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- D. Policy: Tamu dapat menghapus pesan miliknya sendiri
CREATE POLICY "Allow public delete"
ON public.rsvp_messages
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================================
-- 3. AKTIFKAN SUPABASE REALTIME STREAMING
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'rsvp_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp_messages;
  END IF;
END $$;
```

---

## 3.1. Generator SQL Otomatis untuk Klien Baru (`gen:sql`)

Jika Anda memiliki banyak klien/pasangan dan ingin membuat tabel khusus per klien (misal tabel `ahmad_fatimah`, `budi_siti`, `template1`), template ini sudah dilengkapi **skrip generator otomatis**:

### Cara Menggunakan:

**Opsi A: Mode Interaktif (Prompt Tanya-Jawab)**
```bash
npm run gen:sql
```
Ketikkan nama pasangan/klien (misal: `ahmad_fatimah` atau `Budi & Siti`), lalu tekan Enter.

**Opsi B: Mode Langsung (Argumen CLI)**
```bash
node scripts/generate-supabase-table.js "ahmad_fatimah"
```

### Hasil Output:
Skrip akan secara otomatis membuat file panduan & script SQL siap pakai di dalam folder **`supabase-output/`**:
- Contoh file: [`supabase-output/supabase-ahmad-fatimah.md`](../supabase-output/supabase-ahmad-fatimah.md)
- Isi file: Script SQL yang nama tabelnya sudah otomatis disesuaikan, snippet untuk `wedding-config.js`, dan langkah verifikasi. Anda cukup salin seluruh isi SQL dari file tersebut ke SQL Editor Supabase!

---

## 4. Langkah 3: Ambil Kredensial API Supabase

1. Di dashboard Supabase, klik ikon **Settings** (gerigi di pojok kiri bawah) > **Data API** (atau **API**).
2. Temukan bagian **Project URL**:
   - Salin URL proyek (contoh: `https://xyzprojectid.supabase.co`).
3. Temukan bagian **Project API Keys**:
   - Salin kunci bertanda **`anon` `public`**.
   
> [!CAUTION]
> **PERINGATAN KEAMANAN:**  
> **JANGAN PERNAH** menyalin atau memasukkan kunci **`service_role`** ke dalam file template/frontend. Kunci `service_role` membypass seluruh aturan RLS dan hanya boleh digunakan di server backend yang terisolasi.

---

## 5. Langkah 4: Hubungkan ke `wedding-config.js`

Buka file [`wedding-config.js`](../wedding-config.js) dan cari blok `supabase: { ... }`:

```javascript
  // --- KONFIGURASI SUPABASE ---
  supabase: {
    enabled: true, // Ubah dari false menjadi true
    url: "https://xyzprojectid.supabase.co", // Tempel Project URL Anda di sini
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Tempel anon public key di sini
    tableName: "rsvp_messages" // Pastikan sama dengan tabel yang dibuat di SQL
  },
```

Simpan file tersebut. Saat website dibuka kembali di browser, indikator mode demo (*rsvp-preview-note*) akan otomatis disembunyikan dan sistem akan langsung tersambung ke database Supabase.

---

## 6. Verifikasi & Pengujian

### Uji Coba Pengiriman:
1. Buka `index.html` di browser (atau via local dev server / live URL).
2. Scroll ke seksi **Ucapan & Doa**.
3. Isi Nama, pilih Kehadiran (Hadir / Tidak Hadir), dan tulis ucapan.
4. Klik **Kirim Ucapan**.
5. Pesan akan langsung muncul di daftar ucapan dan tersimpan ke Supabase.

### Verifikasi di Dashboard Supabase:
1. Masuk ke dashboard Supabase > menu **Table Editor** (ikon tabel).
2. Pilih tabel `rsvp_messages`.
3. Pastikan baris data ucapan yang Anda kirimkan sudah masuk dengan kolom:
   - `id`, `guest_name`, `attendance`, `message`, `user_id`, `created_at`.

---

## 7. Rekap Data Kehadiran & Moderasi Pesan

### A. Ekspor Data RSVP ke Excel / CSV:
1. Buka menu **Table Editor** > tabel `rsvp_messages`.
2. Klik tombol **Export data** di kanan atas tabel.
3. Pilih **Export as CSV**. File CSV siap diolah di Microsoft Excel / Google Sheets untuk rekap jumlah kehadiran tamu.

### B. Moderasi & Hapus Pesan yang Tidak Pantas:
1. Buka tabel `rsvp_messages` di Table Editor.
2. Centang baris pesan yang ingin dihapus.
3. Klik tombol **Delete row**. (Karena Anda menghapus melalui dashboard admin Supabase, Anda memiliki hak akses penuh).

---

## 8. Panduan Troubleshooting Error Umum

| Gejala Masalah | Penyebab Utama | Solusi |
| :--- | :--- | :--- |
| Pesan tersimpan lokal / Muncul teks *"Mode demo — pesan ditampilkan lokal"* | `supabase.enabled: false` atau `url`/`anonKey` masih kosong | Buka `wedding-config.js`, ubah `enabled: true` dan isi `url` & `anonKey`. |
| Error `401 Unauthorized` / `Invalid API Key` | Salah memasukkan kunci API atau ada karakter terpotong | Salin ulang **`anon` public key** dari menu Project Settings > API di Supabase. |
| Error `42501 new row violates row-level security policy` | Policy RLS untuk `INSERT` belum dibuat | Jalankan ulang script SQL bagian `CREATE POLICY "Public Insert Messages"`. |
| Pesan baru tidak langsung muncul di HP lain | Realtime Publication belum diaktifkan di Supabase | Jalankan perintah SQL `ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp_messages;` atau centang Realtime di Table Editor. |
| Error `Failed to fetch` / CORS | Format URL salah (misal tanpa `https://`) | Pastikan format URL lengkap: `https://<id-project>.supabase.co`. |
| Database Supabase Mati / *Project Paused* | Tidak ada aktivitas query selama 7 hari (aturan Free Tier) | Restore project di dashboard Supabase dan pasang Cron Job Keep-Alive (lihat Bab 9). |

---

## 9. Mencegah Database Free Tier Mati (Anti-Pause / Keep-Alive)

Supabase Free Tier otomatis **pause (hibernasi)** jika tidak ada aktivitas selama **7 hari**. Agar database selalu aktif tanpa upgrade berbayar, gunakan cron job gratis dari [cron-job.org](https://cron-job.org).

### Langkah Cepat Setup (Tiap 3 Hari Sekali):
1. Buka [cron-job.org](https://cron-job.org) dan daftar akun gratis.
2. Klik **Create Cronjob** > pilih menu **Import from cURL**.
3. Salin dan tempel perintah cURL berikut:
   ```bash
   curl -X GET "https://btxznwjdpirejzqbeabp.supabase.co/rest/v1/template1?select=id&limit=1" \
     -H "apikey: sb_publishable_kEhoB8vBm2C2P9nP1F4hJw_eVqcUYq9" \
     -H "Authorization: Bearer sb_publishable_kEhoB8vBm2C2P9nP1F4hJw_eVqcUYq9"
   ```
   *(Sesuaikan URL, nama tabel, dan API Key jika menggunakan project berbeda).*
4. Pada bagian **Schedule**, pilih **User-defined** / Cron Expression lalu isi:
   ```cron
   0 7 */3 * *
   ```
   *(Artinya: Otomatis ping setiap 3 hari sekali pada jam 07:00 pagi).*
5. Klik **Create**. Database Supabase Anda akan selalu aktif otomatis dan tidak akan pernah ter-pause.

