/**
 * ============================================================
 * 💍 BahagiaKita — Wedding Photo Optimizer & Auto-Config
 * ============================================================
 * 
 * Struktur Folder images/:
 * ├── no_photos/                      <-- Default mode tanpa foto (hasPhotos: false)
 * │   ├── islamic/
 * │   └── universal/
 * └── has_photos/                     <-- Mode ada foto (hasPhotos: true)
 *     ├── raw/                        <-- Dropzone foto mentah dari klien
 *     │   ├── profile/                <-- pria.* & wanita.*
 *     │   ├── cover/                  <-- cover.*
 *     │   └── gallery/                <-- Bebas campur foto potret & lanskap
 *     └── final/                      <-- Hasil konversi WebP teroptimasi
 *         ├── profile/
 *         ├── cover/
 *         └── gallery/
 *             ├── portrait/
 *             ├── landscape/
 *             └── .backup/
 * 
 * Penggunaan:
 *   npm run photos:convert
 *   atau jalankan ./convert-photos.sh
 * ============================================================
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HAS_PHOTOS_DIR = path.join(ROOT_DIR, 'images', 'has_photos');
const RAW_DIR = path.join(HAS_PHOTOS_DIR, 'raw');
const RAW_PROFILE_DIR = path.join(RAW_DIR, 'profile');
const RAW_COVER_DIR = path.join(RAW_DIR, 'cover');
const RAW_GALLERY_DIR = path.join(RAW_DIR, 'gallery');

const FINAL_DIR = path.join(HAS_PHOTOS_DIR, 'final');
const DEST_PROFILE_DIR = path.join(FINAL_DIR, 'profile');
const DEST_COVER_DIR = path.join(FINAL_DIR, 'cover');
const DEST_GALLERY_PORTRAIT_DIR = path.join(FINAL_DIR, 'gallery', 'portrait');
const DEST_GALLERY_LANDSCAPE_DIR = path.join(FINAL_DIR, 'gallery', 'landscape');
const GALLERY_BACKUP_BASE = path.join(FINAL_DIR, 'gallery', '.backup');
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

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Scan seluruh file raw dan kelompokkan ke masing-masing kategori
 */
function scanRawImages() {
  ensureDirSync(RAW_DIR);
  ensureDirSync(RAW_PROFILE_DIR);
  ensureDirSync(RAW_COVER_DIR);
  ensureDirSync(RAW_GALLERY_DIR);

  const scanned = {
    groom: null,
    bride: null,
    cover: null,
    gallery: []
  };

  // 1. Cek folder images/has_photos/raw/profile/
  if (fs.existsSync(RAW_PROFILE_DIR)) {
    const profileFiles = fs.readdirSync(RAW_PROFILE_DIR).filter(isImageFile).sort(naturalSort);
    for (const f of profileFiles) {
      const fullPath = path.join(RAW_PROFILE_DIR, f);
      const lower = f.toLowerCase();
      if (!scanned.groom && /pria|male|groom|man|laki|cowok/i.test(lower)) {
        scanned.groom = fullPath;
      } else if (!scanned.bride && /wanita|female|bride|woman|perempuan|cewek/i.test(lower)) {
        scanned.bride = fullPath;
      }
    }
  }

  // 2. Cek folder images/has_photos/raw/cover/
  if (fs.existsSync(RAW_COVER_DIR)) {
    const coverFiles = fs.readdirSync(RAW_COVER_DIR).filter(isImageFile).sort(naturalSort);
    if (coverFiles.length > 0) {
      scanned.cover = path.join(RAW_COVER_DIR, coverFiles[0]);
    }
  }

  // 3. Cek folder images/has_photos/raw/gallery/
  if (fs.existsSync(RAW_GALLERY_DIR)) {
    const galleryFiles = fs.readdirSync(RAW_GALLERY_DIR).filter(isImageFile).sort(naturalSort);
    for (const f of galleryFiles) {
      scanned.gallery.push(path.join(RAW_GALLERY_DIR, f));
    }
  }

  // 4. Flat Fallback: Cek file yang ditaruh langsung di images/has_photos/raw/
  const rootFiles = fs.readdirSync(RAW_DIR).filter((f) => {
    const full = path.join(RAW_DIR, f);
    return fs.statSync(full).isFile() && isImageFile(f);
  }).sort(naturalSort);

  for (const f of rootFiles) {
    const fullPath = path.join(RAW_DIR, f);
    const lower = f.toLowerCase();

    if (!scanned.groom && /pria|male|groom|man|laki|cowok/i.test(lower)) {
      scanned.groom = fullPath;
    } else if (!scanned.bride && /wanita|female|bride|woman|perempuan|cewek/i.test(lower)) {
      scanned.bride = fullPath;
    } else if (!scanned.cover && /cover|sampul|hero|background|bg/i.test(lower)) {
      scanned.cover = fullPath;
    } else {
      // Masuk galeri
      scanned.gallery.push(fullPath);
    }
  }

  return scanned;
}

/**
 * Backup file galeri lama sebelum ditimpa
 */
function backupExistingGallery() {
  const hasPortrait = fs.existsSync(DEST_GALLERY_PORTRAIT_DIR) &&
    fs.readdirSync(DEST_GALLERY_PORTRAIT_DIR).some((f) => f.endsWith('.webp'));
  const hasLandscape = fs.existsSync(DEST_GALLERY_LANDSCAPE_DIR) &&
    fs.readdirSync(DEST_GALLERY_LANDSCAPE_DIR).some((f) => f.endsWith('.webp'));

  if (!hasPortrait && !hasLandscape) return null;

  const backupDir = path.join(GALLERY_BACKUP_BASE, `backup_${getTimestamp()}`);
  ensureDirSync(backupDir);

  if (hasPortrait) {
    const bPort = path.join(backupDir, 'portrait');
    ensureDirSync(bPort);
    const files = fs.readdirSync(DEST_GALLERY_PORTRAIT_DIR).filter((f) => f.endsWith('.webp'));
    for (const f of files) {
      fs.copyFileSync(path.join(DEST_GALLERY_PORTRAIT_DIR, f), path.join(bPort, f));
    }
  }

  if (hasLandscape) {
    const bLand = path.join(backupDir, 'landscape');
    ensureDirSync(bLand);
    const files = fs.readdirSync(DEST_GALLERY_LANDSCAPE_DIR).filter((f) => f.endsWith('.webp'));
    for (const f of files) {
      fs.copyFileSync(path.join(DEST_GALLERY_LANDSCAPE_DIR, f), path.join(bLand, f));
    }
  }

  return backupDir;
}

/**
 * Bersihkan file webp lama di galeri agar tidak ada sisa foto klien sebelumnya
 */
function cleanGalleryFolders() {
  if (fs.existsSync(DEST_GALLERY_PORTRAIT_DIR)) {
    const files = fs.readdirSync(DEST_GALLERY_PORTRAIT_DIR).filter((f) => f.endsWith('.webp'));
    for (const f of files) {
      fs.unlinkSync(path.join(DEST_GALLERY_PORTRAIT_DIR, f));
    }
  }
  if (fs.existsSync(DEST_GALLERY_LANDSCAPE_DIR)) {
    const files = fs.readdirSync(DEST_GALLERY_LANDSCAPE_DIR).filter((f) => f.endsWith('.webp'));
    for (const f of files) {
      fs.unlinkSync(path.join(DEST_GALLERY_LANDSCAPE_DIR, f));
    }
  }
}

async function processSingleImage({ inputPath, outputPath, width, height, fit = 'inside', position = 'center', quality = 82, effort = 6 }) {
  const origStat = fs.statSync(inputPath);
  ensureDirSync(path.dirname(outputPath));

  // EXIF Auto-Rotate diaktifkan (.rotate()) agar foto HP tegak sempurna
  let pipeline = sharp(inputPath).rotate();

  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: fit,
      position: position,
      withoutEnlargement: true
    });
  }

  pipeline = pipeline.webp({
    quality: quality,
    effort: effort
  });

  const buffer = await pipeline.toBuffer();
  fs.writeFileSync(outputPath, buffer);

  return {
    origSize: origStat.size,
    newSize: buffer.length
  };
}

/**
 * Update otomatis wedding-config.js
 */
function updateWeddingConfig({ portraits, landscapes, hasCover, hasGroom, hasBride }) {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.warn('⚠️ wedding-config.js tidak ditemukan, lewati sinkronisasi config.');
    return false;
  }

  let configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
  let changed = false;

  // 1. Aktifkan hasPhotos: true jika ada foto yang diproses
  if (portraits.length > 0 || landscapes.length > 0 || hasCover || hasGroom || hasBride) {
    if (/hasPhotos:\s*false,/.test(configContent)) {
      configContent = configContent.replace(/hasPhotos:\s*false,/, 'hasPhotos: true,');
      changed = true;
    }
  }

  // 2. Update cover foto jika ada
  if (hasCover) {
    // welcome.coverImage
    configContent = configContent.replace(
      /(coverImage:\s*")([^"]*)(")/,
      '$1./images/has_photos/final/cover/cover.webp$3'
    );
    // openGraph.image
    configContent = configContent.replace(
      /(openGraph:\s*\{[\s\S]*?image:\s*")([^"]*)(")/,
      '$1./images/has_photos/final/cover/cover.webp$3'
    );
    // twitter.image
    configContent = configContent.replace(
      /(twitter:\s*\{[\s\S]*?image:\s*")([^"]*)(")/,
      '$1./images/has_photos/final/cover/cover.webp$3'
    );
    changed = true;
  }

  // 3. Update profil foto jika ada
  if (hasGroom) {
    configContent = configContent.replace(
      /(pria:\s*\{[\s\S]*?photo:\s*")([^"]*)(")/,
      '$1./images/has_photos/final/profile/pria.webp$3'
    );
    changed = true;
  }
  if (hasBride) {
    configContent = configContent.replace(
      /(wanita:\s*\{[\s\S]*?photo:\s*")([^"]*)(")/,
      '$1./images/has_photos/final/profile/wanita.webp$3'
    );
    changed = true;
  }

  // 4. Update Galeri Portrait
  if (portraits.length > 0) {
    const portraitLines = portraits.map((p) => `        "${p}"`).join(',\n');
    const portRegex = /(portrait:\s*\[)([\s\S]*?)(\](?=,\s*\n\s*landscape:))/;
    if (portRegex.test(configContent)) {
      configContent = configContent.replace(portRegex, `$1\n${portraitLines}\n      $3`);
      changed = true;
    }

    // Update slideshowImages (ambil hingga 5 foto portrait pertama)
    const slideItems = portraits.slice(0, 5).map((p) => `      "${p}"`).join(',\n');
    const slideRegex = /(slideshowImages:\s*\[)([\s\S]*?)(\])/;
    if (slideRegex.test(configContent)) {
      configContent = configContent.replace(slideRegex, `$1\n${slideItems}\n    $3`);
      changed = true;
    }
  }

  // 5. Update Galeri Landscape
  if (landscapes.length > 0) {
    const landscapeLines = landscapes.map((l) => `        "${l}"`).join(',\n');
    const landRegex = /(landscape:\s*\[)([\s\S]*?)(\](?=\s*\n\s*\}\s*\n\s*\},?\s*\n\s*gift:))/;
    if (landRegex.test(configContent)) {
      configContent = configContent.replace(landRegex, `$1\n${landscapeLines}\n      $3`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(CONFIG_PATH, configContent, 'utf8');
    return true;
  }
  return false;
}

/**
 * Eksekusi Utama
 */
async function main() {
  console.log('\n============================================================');
  console.log(' 💍 BAHAGIAKITA — WEDDING PHOTO OPTIMIZER');
  console.log('============================================================');

  const scanned = scanRawImages();
  const totalRawCount =
    (scanned.groom ? 1 : 0) +
    (scanned.bride ? 1 : 0) +
    (scanned.cover ? 1 : 0) +
    scanned.gallery.length;

  if (totalRawCount === 0) {
    console.log('\n⚠️ Tidak ada foto ditemukan di folder images/has_photos/raw/.');
    console.log('\n📌 Panduan Cepat:');
    console.log('   1. Masukkan foto ke folder:');
    console.log('      - images/has_photos/raw/profile/ (pria.jpg & wanita.jpg)');
    console.log('      - images/has_photos/raw/cover/   (cover.jpg)');
    console.log('      - images/has_photos/raw/gallery/ (bebas campur foto potret & lanskap)');
    console.log('   2. Jalankan kembali: npm run photos:convert\n');
    return;
  }

  console.log(`\n🔍 Terdeteksi ${totalRawCount} file foto raw untuk diproses:`);
  if (scanned.groom) console.log(`   • Profil Pria    : ${path.relative(ROOT_DIR, scanned.groom)}`);
  if (scanned.bride) console.log(`   • Profil Wanita  : ${path.relative(ROOT_DIR, scanned.bride)}`);
  if (scanned.cover) console.log(`   • Foto Cover     : ${path.relative(ROOT_DIR, scanned.cover)}`);
  if (scanned.gallery.length > 0) console.log(`   • Foto Galeri    : ${scanned.gallery.length} file`);

  let totalOrigBytes = 0;
  let totalNewBytes = 0;

  // 1. Proses Profil Pria (Smart Crop: Deteksi Wajah & Skin-Tone)
  if (scanned.groom) {
    console.log('\n🤵 Memproses Foto Profil Pria (Smart Face & Skin-Tone Crop)...');
    const out = path.join(DEST_PROFILE_DIR, 'pria.webp');
    const res = await processSingleImage({
      inputPath: scanned.groom,
      outputPath: out,
      width: 700,
      height: 700,
      fit: 'cover',
      position: sharp.strategy.attention,
      quality: 85
    });
    totalOrigBytes += res.origSize;
    totalNewBytes += res.newSize;
    console.log(`   ✅ Selesai: ${formatBytes(res.origSize)} ➔ ${formatBytes(res.newSize)} (${((1 - res.newSize / res.origSize) * 100).toFixed(1)}% hemat)`);
  }

  // 2. Proses Profil Wanita (Smart Crop: Deteksi Wajah & Skin-Tone)
  if (scanned.bride) {
    console.log('\n👰 Memproses Foto Profil Wanita (Smart Face & Skin-Tone Crop)...');
    const out = path.join(DEST_PROFILE_DIR, 'wanita.webp');
    const res = await processSingleImage({
      inputPath: scanned.bride,
      outputPath: out,
      width: 700,
      height: 700,
      fit: 'cover',
      position: sharp.strategy.attention,
      quality: 85
    });
    totalOrigBytes += res.origSize;
    totalNewBytes += res.newSize;
    console.log(`   ✅ Selesai: ${formatBytes(res.origSize)} ➔ ${formatBytes(res.newSize)} (${((1 - res.newSize / res.origSize) * 100).toFixed(1)}% hemat)`);
  }

  // 3. Proses Foto Cover (Smart Crop: Fokus Subjek)
  if (scanned.cover) {
    console.log('\n🖼️ Memproses Foto Cover (Smart Focus Crop)...');
    const out = path.join(DEST_COVER_DIR, 'cover.webp');
    const res = await processSingleImage({
      inputPath: scanned.cover,
      outputPath: out,
      width: 800,
      height: 1200,
      fit: 'cover',
      position: sharp.strategy.attention,
      quality: 85
    });
    totalOrigBytes += res.origSize;
    totalNewBytes += res.newSize;
    console.log(`   ✅ Selesai: ${formatBytes(res.origSize)} ➔ ${formatBytes(res.newSize)} (${((1 - res.newSize / res.origSize) * 100).toFixed(1)}% hemat)`);
  }

  // 4. Proses Foto Galeri
  const portraitPaths = [];
  const landscapePaths = [];

  if (scanned.gallery.length > 0) {
    console.log('\n🗂️ Mempersiapkan folder galeri...');
    const backupDir = backupExistingGallery();
    if (backupDir) {
      console.log(`   📦 Foto lama berhasil dicadangkan ke: ${path.relative(ROOT_DIR, backupDir)}`);
    }
    cleanGalleryFolders();

    console.log('⚡ Mengonversi foto galeri (Deteksi orientasi & kompresi WebP)...');

    let pIndex = 1;
    let lIndex = 1;

    for (let i = 0; i < scanned.gallery.length; i++) {
      const imgPath = scanned.gallery[i];
      const baseName = path.basename(imgPath);

      // Baca metadata gambar dengan auto-rotate
      const meta = await sharp(imgPath).rotate().metadata();
      const isLandscape = meta.width >= meta.height;

      let outPath;
      let targetW, targetH;

      if (isLandscape) {
        outPath = path.join(DEST_GALLERY_LANDSCAPE_DIR, `${lIndex}.webp`);
        landscapePaths.push(`./images/has_photos/final/gallery/landscape/${lIndex}.webp`);
        targetW = 1200;
        targetH = 800;
        lIndex++;
      } else {
        outPath = path.join(DEST_GALLERY_PORTRAIT_DIR, `${pIndex}.webp`);
        portraitPaths.push(`./images/has_photos/final/gallery/portrait/${pIndex}.webp`);
        targetW = 800;
        targetH = 1200;
        pIndex++;
      }

      const res = await processSingleImage({
        inputPath: imgPath,
        outputPath: outPath,
        width: targetW,
        height: targetH,
        fit: 'inside', // Tidak hard-crop agar saat dibuka di lightbox tetap utuh
        quality: 82,
        effort: 6
      });

      totalOrigBytes += res.origSize;
      totalNewBytes += res.newSize;

      const typeTag = isLandscape ? '[LANDSCAPE]' : '[PORTRAIT] ';
      console.log(`   ${typeTag} ${baseName} ➔ ${path.basename(outPath)} (${formatBytes(res.origSize)} ➔ ${formatBytes(res.newSize)})`);
    }
  }

  // 5. Update Otomatis wedding-config.js
  console.log('\n📝 Memperbarui konfigurasi di wedding-config.js...');
  const configUpdated = updateWeddingConfig({
    portraits: portraitPaths,
    landscapes: landscapePaths,
    hasCover: !!scanned.cover,
    hasGroom: !!scanned.groom,
    hasBride: !!scanned.bride
  });

  if (configUpdated) {
    console.log('   ✅ wedding-config.js berhasil diperbarui secara otomatis!');
  } else {
    console.log('   ℹ️ Tidak ada perubahan konfigurasi yang perlu ditulis.');
  }

  // 6. Ringkasan Akhir
  const savedPercent = totalOrigBytes > 0 ? (((totalOrigBytes - totalNewBytes) / totalOrigBytes) * 100).toFixed(1) : 0;
  console.log('\n============================================================');
  console.log(' 🎉 KONVERSI SELESAI!');
  console.log('============================================================');
  console.log(` • Total Foto Diproses : ${totalRawCount} file`);
  if (portraitPaths.length > 0) console.log(` • Galeri Portrait     : ${portraitPaths.length} file (${path.relative(ROOT_DIR, DEST_GALLERY_PORTRAIT_DIR)})`);
  if (landscapePaths.length > 0) console.log(` • Galeri Landscape    : ${landscapePaths.length} file (${path.relative(ROOT_DIR, DEST_GALLERY_LANDSCAPE_DIR)})`);
  console.log(` • Ukuran Sebelum      : ${formatBytes(totalOrigBytes)}`);
  console.log(` • Ukuran Sesudah      : ${formatBytes(totalNewBytes)}`);
  console.log(` • Penghematan Ruang   : ${savedPercent}% lebih ringan`);
  console.log('------------------------------------------------------------');
  console.log(' 💡 CATATAN PENTING:');
  console.log(' Tekan [ Ctrl + Shift + R ] di browser Anda untuk Hard Refresh');
  console.log(' agar browser memuat foto-foto baru tanpa memakai cache lama.');
  console.log('============================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Terjadi kesalahan saat memproses foto:', err);
  process.exit(1);
});
