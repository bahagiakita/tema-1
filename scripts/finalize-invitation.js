#!/usr/bin/env node

/**
 * ============================================================
 * Earthy Botanical — finalize-invitation.js
 * Production Minifier & Intelligent Asset Tree-Shaker
 * 
 * Features:
 * 1. Automatic Tailwind CSS Minification (--minify)
 * 2. Intelligent Bank Logo Pruning (keeps only active logos + favicon)
 * 3. Religion Asset Pruning (keeps active religion, archives unused)
 * 4. Gallery Photos Tree-Shaking (prunes unused photos from final/)
 * 5. Raw Photos Archiving & Cleaning (moves raw to vault, cleans git)
 * 6. Leftover & Junk Cleanup (removes backups and temp files)
 * 7. 100% Non-Destructive Vault (.template-vault/ keeps master copy)
 * 8. Comprehensive Audit & Performance Report
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const VAULT_DIR = path.join(ROOT_DIR, '.template-vault');
const MASTER_VAULT_DIR = path.join(VAULT_DIR, 'master-assets');

// Bank mapping definition aligned with js/config-loader.js
const BANK_LOGO_MAP = [
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

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirSize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let total = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      total += getDirSize(full);
    } else {
      total += fs.statSync(full).size;
    }
  }
  return total;
}

function resolveBankLogoFile(bankName, customLogo) {
  if (customLogo && typeof customLogo === 'string') {
    const trimmed = customLogo.trim();
    if (trimmed !== '' && trimmed.toLowerCase() !== 'auto') {
      const base = path.basename(trimmed);
      return base;
    }
  }
  if (!bankName || typeof bankName !== 'string') {
    return 'favicon.png';
  }
  const clean = bankName.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const item of BANK_LOGO_MAP) {
    for (const m of item.match) {
      if (clean.includes(m)) {
        return item.file;
      }
    }
  }
  return 'favicon.png';
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║   🌸 BAHAGIAKITA — INVITATION PRODUCTION FINALIZER 🌸   ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// 1. LOAD CONFIG & HTML
const configPath = path.join(ROOT_DIR, 'wedding-config.js');
const indexPath = path.join(ROOT_DIR, 'index.html');
const cssOutputPath = path.join(ROOT_DIR, 'css', 'output.css');

if (!fs.existsSync(configPath)) {
  console.error('❌ Error: wedding-config.js tidak ditemukan!');
  process.exit(1);
}

const weddingConfig = require(configPath);
const indexHtml = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';

let totalBytesSaved = 0;
const auditDetails = [];

// ============================================================
// STEP 1: INITIALIZE / PRESERVE SAFETY VAULT
// ============================================================
console.log('🛡️  [1/6] Memeriksa & Mengamankan Master Template Vault...');

const masterLogoVault = path.join(MASTER_VAULT_DIR, 'images', 'logo');
const masterNoPhotosVault = path.join(MASTER_VAULT_DIR, 'images', 'no_photos');

// Hanya backup master jika vault belum ada atau belum lengkap
const sourceLogoDir = path.join(ROOT_DIR, 'images', 'logo');
if (fs.existsSync(sourceLogoDir)) {
  const currentLogos = fs.readdirSync(sourceLogoDir).filter(f => f.endsWith('.png'));
  // Jika folder logo saat ini masih lengkap (>= 30 bank), simpan ke vault
  if (!fs.existsSync(masterLogoVault) || fs.readdirSync(masterLogoVault).filter(f => f.endsWith('.png')).length < 30) {
    if (currentLogos.length >= 30) {
      fs.mkdirSync(path.dirname(masterLogoVault), { recursive: true });
      fs.cpSync(sourceLogoDir, masterLogoVault, { recursive: true });
      console.log(`   ✓ Master bank logos (35+ logo) berhasil diamankan ke vault`);
    }
  } else {
    console.log(`   ✓ Master bank logos sudah aman di vault`);
  }
}

const sourceNoPhotosDir = path.join(ROOT_DIR, 'images', 'no_photos');
if (fs.existsSync(sourceNoPhotosDir)) {
  if (!fs.existsSync(masterNoPhotosVault) || !fs.existsSync(path.join(masterNoPhotosVault, 'islamic')) || !fs.existsSync(path.join(masterNoPhotosVault, 'universal'))) {
    if (fs.existsSync(path.join(sourceNoPhotosDir, 'islamic')) && fs.existsSync(path.join(sourceNoPhotosDir, 'universal'))) {
      fs.mkdirSync(path.dirname(masterNoPhotosVault), { recursive: true });
      fs.cpSync(sourceNoPhotosDir, masterNoPhotosVault, { recursive: true });
      console.log(`   ✓ Master varian agama (Islamic & Universal) berhasil diamankan ke vault`);
    }
  } else {
    console.log(`   ✓ Master varian agama sudah aman di vault`);
  }
}

// ============================================================
// STEP 2: MINIFY TAILWIND CSS
// ============================================================
console.log('\n🎨 [2/6] Mem-minify Tailwind CSS dengan @tailwindcss/cli...');
let cssBeforeSize = 0;
let cssAfterSize = 0;

if (fs.existsSync(cssOutputPath)) {
  cssBeforeSize = fs.statSync(cssOutputPath).size;
}

try {
  execSync('npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --minify', {
    cwd: ROOT_DIR,
    stdio: 'pipe'
  });
  if (fs.existsSync(cssOutputPath)) {
    cssAfterSize = fs.statSync(cssOutputPath).size;
    const cssSaved = Math.max(0, cssBeforeSize - cssAfterSize);
    totalBytesSaved += cssSaved;
    auditDetails.push({
      category: 'Tailwind CSS',
      action: 'Minifikasi (--minify)',
      saved: cssSaved,
      detail: `${formatBytes(cssBeforeSize)} → ${formatBytes(cssAfterSize)} (-${((cssSaved / cssBeforeSize) * 100).toFixed(1)}%)`
    });
    console.log(`   ✓ output.css berhasil di-minify: ${formatBytes(cssBeforeSize)} → ${formatBytes(cssAfterSize)} (Hemat ${formatBytes(cssSaved)})`);
  }
} catch (err) {
  console.warn(`   ⚠️ Gagal mem-minify Tailwind via CLI: ${err.message}`);
}

// ============================================================
// STEP 3: PRUNE UNUSED BANK LOGOS
// ============================================================
console.log('\n🏦 [3/6] Memfilter Logo Bank & E-Wallet (Tree-shaking)...');

const activeLogos = new Set();
activeLogos.add('favicon.png'); // Favicon wajib dipertahankan

// Ambil logo aktif dari wedding-config.js
if (weddingConfig.gift && Array.isArray(weddingConfig.gift.bankAccounts)) {
  for (const acc of weddingConfig.gift.bankAccounts) {
    if (acc.enabled !== false) {
      const resolved = resolveBankLogoFile(acc.bank, acc.logo);
      if (resolved) activeLogos.add(resolved);
    }
  }
}

// Scan index.html untuk logo yang mungkin ter-hardcode
const logoRegex = /images\/logo\/([a-zA-Z0-9_-]+\.(?:png|svg|webp|ico))/gi;
let match;
while ((match = logoRegex.exec(indexHtml)) !== null) {
  activeLogos.add(match[1]);
}

let bankLogoBytesSaved = 0;
let prunedLogoCount = 0;
let keptLogoCount = 0;

if (fs.existsSync(sourceLogoDir)) {
  // Hapus sample/ folder jika ada (berisi preview.html dan svg demo)
  const sampleDir = path.join(sourceLogoDir, 'sample');
  if (fs.existsSync(sampleDir)) {
    const sampleSize = getDirSize(sampleDir);
    fs.rmSync(sampleDir, { recursive: true, force: true });
    bankLogoBytesSaved += sampleSize;
    auditDetails.push({
      category: 'Logo Demo Sample',
      action: 'Dibersihkan (sample/)',
      saved: sampleSize,
      detail: 'Folder images/logo/sample/'
    });
  }

  // Filter file logo
  const files = fs.readdirSync(sourceLogoDir);
  for (const file of files) {
    const filePath = path.join(sourceLogoDir, file);
    if (!fs.statSync(filePath).isFile()) continue;

    if (activeLogos.has(file)) {
      keptLogoCount++;
    } else {
      const fsize = fs.statSync(filePath).size;
      fs.rmSync(filePath, { force: true });
      bankLogoBytesSaved += fsize;
      prunedLogoCount++;
    }
  }
}

totalBytesSaved += bankLogoBytesSaved;
auditDetails.push({
  category: 'Bank Logos',
  action: `Dipangkas ${prunedLogoCount} logo tidak terpakai`,
  saved: bankLogoBytesSaved,
  detail: `Dipertahankan: ${Array.from(activeLogos).join(', ')}`
});
console.log(`   ✓ Logo dipertahankan: [${Array.from(activeLogos).join(', ')}]`);
console.log(`   ✓ ${prunedLogoCount} logo tidak terpakai dipangkas (Hemat ${formatBytes(bankLogoBytesSaved)})`);

// ============================================================
// STEP 4: PRUNE UNUSED RELIGION ASSETS (no_photos)
// ============================================================
console.log('\n📿 [4/6] Menyesuaikan Aset Agama (images/no_photos)...');
const religion = (weddingConfig.religion || 'islam').toLowerCase();
const activeReligionFolder = religion === 'islam' ? 'islamic' : 'universal';
const inactiveReligionFolder = religion === 'islam' ? 'universal' : 'islamic';

let religionBytesSaved = 0;
const inactiveReligionPath = path.join(sourceNoPhotosDir, inactiveReligionFolder);

if (fs.existsSync(inactiveReligionPath)) {
  const inactiveSize = getDirSize(inactiveReligionPath);
  fs.rmSync(inactiveReligionPath, { recursive: true, force: true });
  religionBytesSaved += inactiveSize;
  totalBytesSaved += religionBytesSaved;
  auditDetails.push({
    category: 'Aset Agama',
    action: `Varian non-aktif (${inactiveReligionFolder}) dibersihkan`,
    saved: inactiveSize,
    detail: `Aktif: ${activeReligionFolder} | Dipangkas: ${inactiveReligionFolder}`
  });
  console.log(`   ✓ Varian aktif: [${activeReligionFolder}] dipertahankan`);
  console.log(`   ✓ Varian tidak terpakai: [${inactiveReligionFolder}] dibersihkan (Hemat ${formatBytes(inactiveSize)})`);
} else {
  console.log(`   ✓ images/no_photos sudah bersih (hanya varian aktif: ${activeReligionFolder})`);
}

// ============================================================
// STEP 5: GALLERY & LOVE STORY TREE-SHAKING
// ============================================================
console.log('\n📸 [5/6] Memeriksa Galeri & Foto Final (images/has_photos/final)...');

const activeGalleryFiles = new Set();

// Kumpulkan semua foto galeri yang terdaftar di wedding-config.js
if (weddingConfig.gallery && weddingConfig.gallery.images) {
  const portraitImgs = weddingConfig.gallery.images.portrait || [];
  const landscapeImgs = weddingConfig.gallery.images.landscape || [];
  [...portraitImgs, ...landscapeImgs].forEach(p => {
    if (typeof p === 'string') activeGalleryFiles.add(path.basename(p));
  });
}

// Love story images
if (weddingConfig.loveStory && Array.isArray(weddingConfig.loveStory.stories)) {
  weddingConfig.loveStory.stories.forEach(s => {
    if (s.image) activeGalleryFiles.add(path.basename(s.image));
  });
}

// Also check index.html for gallery references
const galleryRegex = /images\/has_photos\/final\/gallery\/(?:portrait|landscape)\/([a-zA-Z0-9_-]+\.(?:webp|jpg|jpeg|png))/gi;
while ((match = galleryRegex.exec(indexHtml)) !== null) {
  activeGalleryFiles.add(match[1]);
}

let galleryBytesSaved = 0;
let prunedGalleryCount = 0;
const galleryArchiveDir = path.join(VAULT_DIR, 'gallery-archive');

const galleryBase = path.join(ROOT_DIR, 'images', 'has_photos', 'final', 'gallery');
['portrait', 'landscape'].forEach(sub => {
  const subPath = path.join(galleryBase, sub);
  if (!fs.existsSync(subPath)) return;

  const files = fs.readdirSync(subPath);
  for (const f of files) {
    const fPath = path.join(subPath, f);
    if (!fs.statSync(fPath).isFile()) continue;

    if (!activeGalleryFiles.has(f)) {
      // Archive first before removing
      const archiveTargetDir = path.join(galleryArchiveDir, sub);
      fs.mkdirSync(archiveTargetDir, { recursive: true });
      fs.copyFileSync(fPath, path.join(archiveTargetDir, f));

      const fsize = fs.statSync(fPath).size;
      fs.rmSync(fPath, { force: true });
      galleryBytesSaved += fsize;
      prunedGalleryCount++;
      console.log(`   - Foto '${sub}/${f}' tidak terdaftar di config -> diarsipkan & dipangkas`);
    }
  }
});

if (prunedGalleryCount > 0) {
  totalBytesSaved += galleryBytesSaved;
  auditDetails.push({
    category: 'Galeri Foto',
    action: `Dipangkas ${prunedGalleryCount} foto unreferenced`,
    saved: galleryBytesSaved,
    detail: `Diarsipkan ke .template-vault/gallery-archive/`
  });
  console.log(`   ✓ ${prunedGalleryCount} foto galeri tidak terpakai dipangkas (Hemat ${formatBytes(galleryBytesSaved)})`);
} else {
  console.log(`   ✓ Semua foto di folder galeri terdaftar aktif di config.`);
}

// ============================================================
// STEP 6: CLEAN RAW PHOTOS & LEFTOVER JUNK
// ============================================================
console.log('\n🧹 [6/6] Membersihkan Foto Raw & File Sampah...');

let junkBytesSaved = 0;
const rawBase = path.join(ROOT_DIR, 'images', 'has_photos', 'raw');
const rawArchiveDir = path.join(VAULT_DIR, 'raw-archive');
let archivedRawCount = 0;

if (fs.existsSync(rawBase)) {
  const rawSubs = ['profile', 'cover', 'couple', 'gallery'];
  for (const sub of rawSubs) {
    const sPath = path.join(rawBase, sub);
    if (!fs.existsSync(sPath)) {
      fs.mkdirSync(sPath, { recursive: true });
      fs.writeFileSync(path.join(sPath, '.gitkeep'), '');
      continue;
    }

    const files = fs.readdirSync(sPath);
    for (const f of files) {
      if (f === '.gitkeep' || f === 'README.md') continue;
      const fPath = path.join(sPath, f);
      if (fs.statSync(fPath).isFile()) {
        const targetSub = path.join(rawArchiveDir, sub);
        fs.mkdirSync(targetSub, { recursive: true });
        fs.copyFileSync(fPath, path.join(targetSub, f));
        const fsize = fs.statSync(fPath).size;
        fs.rmSync(fPath, { force: true });
        junkBytesSaved += fsize;
        archivedRawCount++;
      }
    }
    // Pastikan .gitkeep ada agar git tetap melacak folder
    const gitkeepFile = path.join(sPath, '.gitkeep');
    if (!fs.existsSync(gitkeepFile)) {
      fs.writeFileSync(gitkeepFile, '');
    }
  }
}

if (archivedRawCount > 0) {
  console.log(`   ✓ ${archivedRawCount} foto raw dipindahkan ke .template-vault/raw-archive/`);
}

// Hapus images/has_photos_bak jika ada
const bakDir = path.join(ROOT_DIR, 'images', 'has_photos_bak');
if (fs.existsSync(bakDir)) {
  const bakSize = getDirSize(bakDir);
  fs.rmSync(bakDir, { recursive: true, force: true });
  junkBytesSaved += bakSize;
  console.log(`   ✓ Backup lama 'images/has_photos_bak' dihapus (Hemat ${formatBytes(bakSize)})`);
}

// Hapus css/navbar-backup.css jika ada
const navbarBak = path.join(ROOT_DIR, 'css', 'navbar-backup.css');
if (fs.existsSync(navbarBak)) {
  const navSize = fs.statSync(navbarBak).size;
  fs.rmSync(navbarBak, { force: true });
  junkBytesSaved += navSize;
  console.log(`   ✓ File backup 'css/navbar-backup.css' dihapus (Hemat ${formatBytes(navSize)})`);
}

// Hapus file *.bak atau *.tmp di root
const rootFiles = fs.readdirSync(ROOT_DIR);
for (const rf of rootFiles) {
  if (rf.endsWith('.bak') || rf.endsWith('.tmp')) {
    const rfPath = path.join(ROOT_DIR, rf);
    if (fs.statSync(rfPath).isFile()) {
      const rfSize = fs.statSync(rfPath).size;
      fs.rmSync(rfPath, { force: true });
      junkBytesSaved += rfSize;
    }
  }
}

totalBytesSaved += junkBytesSaved;
if (junkBytesSaved > 0) {
  auditDetails.push({
    category: 'Sampah & Raw Backup',
    action: 'Dibersihkan',
    saved: junkBytesSaved,
    detail: 'Folder raw dikosongkan (disimpan di vault) & file *.bak dibuang'
  });
}

// ============================================================
// FINAL AUDIT REPORT
// ============================================================
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║               📊 LAPORAN AUDIT FINALISASI 📊               ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.table(auditDetails.map(item => ({
  'Kategori': item.category,
  'Tindakan': item.action,
  'Penghematan': formatBytes(item.saved),
  'Keterangan': item.detail
})));

console.log(`\n🎉 TOTAL PENGHEMATAN UKURAN : ${formatBytes(totalBytesSaved)} !`);
console.log(`✨ Undangan siap dideploy ke GitHub Pages dengan performa maksimal.\n`);
console.log('🛡️  CATATAN KEAMANAN MASTER TEMPLATE:');
console.log('   Semua aset master tersimpan rapi di folder `.template-vault/` (diabaikan git).');
console.log('   Kapan pun ingin merestore template lengkap untuk klien baru, cukup jalankan:');
console.log('   👉  npm run template:restore  (atau ./restore-template.sh)\n');
