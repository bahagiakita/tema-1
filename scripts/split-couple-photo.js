/**
 * ============================================================
 * 💍 BahagiaKita — Single Couple Photo Auto-Splitter & Optimizer
 * ============================================================
 * 
 * Script khusus untuk skenario:
 * Klien HANYA mengirimkan 1 FOTO BERDUA (Pria & Wanita).
 * 
 * Dari 1 foto tersebut, script ini secara otomatis:
 * 1. Menjadikannya Foto Utama / Cover Landing Page (800x1200 WebP)
 * 2. Meng-crop foto Mempelai Pria (700x700 1:1 WebP dengan Smart Face Crop)
 * 3. Meng-crop foto Mempelai Wanita (700x700 1:1 WebP dengan Smart Face Crop)
 * 4. Otomatis mengupdate konfigurasi di wedding-config.js
 * 
 * Penggunaan:
 *   npm run couple:convert
 *   atau jalankan ./convert-couple-photo.sh
 *   atau node scripts/split-couple-photo.js [path/to/photo.jpg] [--swap]
 * ============================================================
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT_DIR = path.resolve(__dirname, '..');
const HAS_PHOTOS_DIR = path.join(ROOT_DIR, 'images', 'has_photos');
const RAW_DIR = path.join(HAS_PHOTOS_DIR, 'raw');
const RAW_COUPLE_DIR = path.join(RAW_DIR, 'couple');

const FINAL_DIR = path.join(HAS_PHOTOS_DIR, 'final');
const DEST_PROFILE_DIR = path.join(FINAL_DIR, 'profile');
const DEST_COVER_DIR = path.join(FINAL_DIR, 'cover');
const DEST_GALLERY_PORTRAIT_DIR = path.join(FINAL_DIR, 'gallery', 'portrait');
const DEST_GALLERY_LANDSCAPE_DIR = path.join(FINAL_DIR, 'gallery', 'landscape');
const CONFIG_PATH = path.join(ROOT_DIR, 'wedding-config.js');

const VALID_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tiff', '.tif', '.avif'];

function isImageFile(fileName) {
  if (fileName.startsWith('.')) return false;
  const ext = path.extname(fileName).toLowerCase();
  return VALID_IMAGE_EXTS.includes(ext);
}

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Mencari 1 file foto couple
 */
function findCoupleImage() {
  ensureDirSync(RAW_DIR);
  ensureDirSync(RAW_COUPLE_DIR);

  // 1. Cek argumen CLI (misal node scripts/split-couple-photo.js myphoto.jpg)
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (args.length > 0 && fs.existsSync(args[0])) {
    return path.resolve(args[0]);
  }

  // 2. Cek folder images/has_photos/raw/couple/
  if (fs.existsSync(RAW_COUPLE_DIR)) {
    const coupleFiles = fs.readdirSync(RAW_COUPLE_DIR).filter(isImageFile).sort(naturalSort);
    if (coupleFiles.length > 0) {
      return path.join(RAW_COUPLE_DIR, coupleFiles[0]);
    }
  }

  // 3. Cek file di images/has_photos/raw/ yang bernama couple / berdua / pasangan
  if (fs.existsSync(RAW_DIR)) {
    const rootFiles = fs.readdirSync(RAW_DIR).filter((f) => {
      const full = path.join(RAW_DIR, f);
      return fs.statSync(full).isFile() && isImageFile(f);
    }).sort(naturalSort);

    const coupleMatch = rootFiles.find((f) => /couple|berdua|pasangan|duo|dua/i.test(f));
    if (coupleMatch) {
      return path.join(RAW_DIR, coupleMatch);
    }

    // Jika hanya ada tepat 1 gambar di root raw
    if (rootFiles.length === 1) {
      return path.join(RAW_DIR, rootFiles[0]);
    }
  }

  return null;
}

/**
 * Menanyakan posisi mempelai jika dijalankan di terminal interaktif
 */
async function askPositionPreference(cliSwap) {
  if (cliSwap !== undefined) {
    return cliSwap;
  }

  // Jika non-interactive / bukan TTY, gunakan default (Pria di Kiri)
  if (!process.stdin.isTTY) {
    return false;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n❓ Siapa yang berada di sisi KIRI pada foto berdua tersebut?');
    console.log('   [1] Mempelai Pria di KIRI, Mempelai Wanita di KANAN (Default)');
    console.log('   [2] Mempelai Wanita di KIRI, Mempelai Pria di KANAN');

    // Timeout otomatis 10 detik default ke pilihan 1 jika user tidak merespon
    const timer = setTimeout(() => {
      console.log('\n⏱️ Waktu habis, menggunakan default: [1] Pria di Kiri, Wanita di Kanan.');
      rl.close();
      resolve(false);
    }, 10000);

    rl.question('\nPilihan Anda [1/2] (Tekan Enter untuk [1]): ', (answer) => {
      clearTimeout(timer);
      rl.close();
      const ans = answer.trim();
      if (ans === '2') {
        resolve(true); // Swapped: Wanita Kiri, Pria Kanan
      } else {
        resolve(false); // Default: Pria Kiri, Wanita Kanan
      }
    });
  });
}

/**
 * Update otomatis wedding-config.js
 */
function updateWeddingConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.warn('⚠️ wedding-config.js tidak ditemukan, lewati update config.');
    return false;
  }

  let content = fs.readFileSync(CONFIG_PATH, 'utf8');

  // 1. hasPhotos: true
  content = content.replace(/hasPhotos:\s*(false|true),/, 'hasPhotos: true,');

  // 2. Cover & SEO images
  content = content.replace(
    /(coverImage:\s*")([^"]*)(")/,
    '$1./images/has_photos/final/cover/cover.webp$3'
  );
  content = content.replace(
    /(openGraph:\s*\{[\s\S]*?image:\s*")([^"]*)(")/,
    '$1./images/has_photos/final/cover/cover.webp$3'
  );
  content = content.replace(
    /(twitter:\s*\{[\s\S]*?image:\s*")([^"]*)(")/,
    '$1./images/has_photos/final/cover/cover.webp$3'
  );

  // 3. Slideshow welcome
  content = content.replace(
    /(slideshowImages:\s*\[)([\s\S]*?)(\])/,
    '$1\n      "./images/has_photos/final/cover/cover.webp"\n    $3'
  );

  // 4. Profil Pria & Wanita
  content = content.replace(
    /(pria:\s*\{[\s\S]*?photo:\s*")([^"]*)(")/,
    '$1./images/has_photos/final/profile/pria.webp$3'
  );
  content = content.replace(
    /(wanita:\s*\{[\s\S]*?photo:\s*")([^"]*)(")/,
    '$1./images/has_photos/final/profile/wanita.webp$3'
  );

  fs.writeFileSync(CONFIG_PATH, content, 'utf8');
  return true;
}

/**
 * Eksekusi Utama
 */
async function main() {
  console.log('\n============================================================');
  console.log(' 👩‍❤️‍👨 BAHAGIAKITA — SINGLE COUPLE PHOTO AUTO-SPLITTER');
  console.log('============================================================');

  const coupleImgPath = findCoupleImage();

  if (!coupleImgPath) {
    console.log('\n⚠️ Tidak ada foto berdua ditemukan!');
    console.log('\n📌 Cara Menggunakan:');
    console.log('   1. Masukkan 1 foto berdua ke salah satu tempat berikut:');
    console.log('      - images/has_photos/raw/couple/ (nama file bebas, misal: foto-kami.jpg)');
    console.log('      - images/has_photos/raw/ (beri nama: couple.jpg atau berdua.jpg)');
    console.log('   2. Jalankan kembali: npm run couple:convert');
    console.log('   (Atau: node scripts/split-couple-photo.js path/ke/foto.jpg)\n');
    return;
  }

  // Cek flag CLI
  const isSwapCli = process.argv.includes('--swap') ||
    process.argv.includes('--wanita-kiri') ||
    process.argv.includes('--bride-left');
  const isPriaKiriCli = process.argv.includes('--pria-kiri') || process.argv.includes('--groom-left');

  let isSwapped = false;
  const fileNameLower = path.basename(coupleImgPath).toLowerCase();

  if (fileNameLower.includes('wanita-kiri') || fileNameLower.includes('bride-left') || isSwapCli) {
    isSwapped = true;
  } else if (fileNameLower.includes('pria-kiri') || fileNameLower.includes('groom-left') || isPriaKiriCli) {
    isSwapped = false;
  } else {
    isSwapped = await askPositionPreference(undefined);
  }

  console.log(`\n📸 Memproses foto sumber: ${path.relative(ROOT_DIR, coupleImgPath)}`);
  console.log(`🧭 Susunan subjek: ${isSwapped ? 'Wanita di KIRI 👧, Pria di KANAN 👦' : 'Pria di KIRI 👦, Wanita di KANAN 👧'}`);

  const origStat = fs.statSync(coupleImgPath);
  const meta = await sharp(coupleImgPath).rotate().metadata();
  const w = meta.width;
  const h = meta.height;

  console.log(`📐 Resolusi asli: ${w} × ${h} px (${formatBytes(origStat.size)})`);

  ensureDirSync(DEST_COVER_DIR);
  ensureDirSync(DEST_PROFILE_DIR);
  ensureDirSync(DEST_GALLERY_PORTRAIT_DIR);
  ensureDirSync(DEST_GALLERY_LANDSCAPE_DIR);

  // ------------------------------------------------------------
  // 1. PROSES COVER / HERO UTAMA (Foto Utuh Teroptimasi)
  // ------------------------------------------------------------
  console.log('\n1️⃣ Membuat Foto Cover Utama (Landing Page)...');
  const coverPath = path.join(DEST_COVER_DIR, 'cover.webp');
  await sharp(coupleImgPath)
    .rotate()
    .resize(800, 1200, {
      fit: 'cover',
      position: sharp.strategy.attention
    })
    .webp({ quality: 85, effort: 6 })
    .toFile(coverPath);

  const coverStat = fs.statSync(coverPath);
  console.log(`   ✅ Selesai: images/has_photos/final/cover/cover.webp (${formatBytes(coverStat.size)})`);

  // ------------------------------------------------------------
  // 2. SMART CROP: SISI KIRI
  // ------------------------------------------------------------
  // Ambil 65% sisi kiri agar tubuh & wajah tetap leluasa ter-cover
  const leftW = Math.round(w * 0.65);
  const leftSubject = isSwapped ? 'Wanita' : 'Pria';
  const leftFileName = isSwapped ? 'wanita.webp' : 'pria.webp';
  const leftOutPath = path.join(DEST_PROFILE_DIR, leftFileName);

  console.log(`\n2️⃣ Meng-crop Profil ${leftSubject} (Sisi Kiri)...`);
  await sharp(coupleImgPath)
    .rotate()
    .extract({ left: 0, top: 0, width: leftW, height: h })
    .resize(700, 700, {
      fit: 'cover',
      position: sharp.strategy.attention // Otomatis fokus ke wajah & kulit
    })
    .webp({ quality: 85, effort: 6 })
    .toFile(leftOutPath);

  const leftStat = fs.statSync(leftOutPath);
  console.log(`   ✅ Selesai: images/has_photos/final/profile/${leftFileName} (${formatBytes(leftStat.size)})`);

  // ------------------------------------------------------------
  // 3. SMART CROP: SISI KANAN
  // ------------------------------------------------------------
  // Ambil 65% sisi kanan (mulai dari 35% lebar foto)
  const rightX = Math.round(w * 0.35);
  const rightW = w - rightX;
  const rightSubject = isSwapped ? 'Pria' : 'Wanita';
  const rightFileName = isSwapped ? 'pria.webp' : 'wanita.webp';
  const rightOutPath = path.join(DEST_PROFILE_DIR, rightFileName);

  console.log(`\n3️⃣ Meng-crop Profil ${rightSubject} (Sisi Kanan)...`);
  await sharp(coupleImgPath)
    .rotate()
    .extract({ left: rightX, top: 0, width: rightW, height: h })
    .resize(700, 700, {
      fit: 'cover',
      position: sharp.strategy.attention // Otomatis fokus ke wajah & kulit
    })
    .webp({ quality: 85, effort: 6 })
    .toFile(rightOutPath);

  const rightStat = fs.statSync(rightOutPath);
  console.log(`   ✅ Selesai: images/has_photos/final/profile/${rightFileName} (${formatBytes(rightStat.size)})`);

  // ------------------------------------------------------------
  // 4. UPDATE KONFIGURASI WEDDING-CONFIG.JS
  // ------------------------------------------------------------
  console.log('\n📝 Memperbarui konfigurasi di wedding-config.js...');
  updateWeddingConfig();
  console.log('   ✅ wedding-config.js berhasil disinkronkan otomatis!');

  // ------------------------------------------------------------
  // RINGKASAN AKHIR
  // ------------------------------------------------------------
  const totalNewBytes = coverStat.size + leftStat.size + rightStat.size;
  const savedPercent = (((origStat.size - totalNewBytes) / origStat.size) * 100).toFixed(1);

  console.log('\n============================================================');
  console.log(' 🎉 1 FOTO BERHASIL DIPROSES MENJADI 3 ASET LENGKAP!');
  console.log('============================================================');
  console.log(` • Cover Utama    : images/has_photos/final/cover/cover.webp (800x1200)`);
  console.log(` • Profil Pria    : images/has_photos/final/profile/pria.webp (700x700 1:1)`);
  console.log(` • Profil Wanita  : images/has_photos/final/profile/wanita.webp (700x700 1:1)`);
  console.log(` • Ukuran Asal    : ${formatBytes(origStat.size)}`);
  console.log(` • Total 3 Output : ${formatBytes(totalNewBytes)} (${savedPercent}% lebih hemat)`);
  console.log('------------------------------------------------------------');
  console.log(' 💡 CATATAN:');
  console.log(' Jika posisi Pria & Wanita tertukar, Anda cukup menjalankan:');
  console.log('   npm run couple:convert -- --swap');
  console.log(' Tekan [ Ctrl + Shift + R ] di browser untuk melihat hasil terbaru!');
  console.log('============================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Terjadi kesalahan saat memproses foto couple:', err);
  process.exit(1);
});
