#!/usr/bin/env node

/**
 * ============================================================
 * Earthy Botanical — restore-template.js
 * Master Template Restorer
 * 
 * Restores the complete template assets from `.template-vault/`:
 * 1. Restores all 35 bank & e-wallet logos + preview samples
 * 2. Restores all religion assets (Islamic & Universal)
 * 3. Restores any archived gallery photos
 * 4. Rebuilds Tailwind CSS in normal/dev mode
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const VAULT_DIR = path.join(ROOT_DIR, '.template-vault');
const MASTER_VAULT_DIR = path.join(VAULT_DIR, 'master-assets');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║    🔄 BAHAGIAKITA — MASTER TEMPLATE RESTORER 🔄           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

if (!fs.existsSync(MASTER_VAULT_DIR)) {
  console.error('❌ Error: Folder `.template-vault/master-assets` tidak ditemukan!');
  console.error('   Tidak ada backup master template yang tersimpan.');
  process.exit(1);
}

// 1. RESTORE BANK LOGOS
const vaultLogos = path.join(MASTER_VAULT_DIR, 'images', 'logo');
const targetLogos = path.join(ROOT_DIR, 'images', 'logo');

if (fs.existsSync(vaultLogos)) {
  fs.mkdirSync(targetLogos, { recursive: true });
  fs.cpSync(vaultLogos, targetLogos, { recursive: true });
  const count = fs.readdirSync(targetLogos).filter(f => f.endsWith('.png')).length;
  console.log(`✓ Logo bank & e-wallet berhasil di-restore (${count} logo lengkap + sample folder)`);
}

// 2. RESTORE RELIGION ASSETS (no_photos)
const vaultNoPhotos = path.join(MASTER_VAULT_DIR, 'images', 'no_photos');
const targetNoPhotos = path.join(ROOT_DIR, 'images', 'no_photos');

if (fs.existsSync(vaultNoPhotos)) {
  fs.mkdirSync(targetNoPhotos, { recursive: true });
  fs.cpSync(vaultNoPhotos, targetNoPhotos, { recursive: true });
  console.log('✓ Aset mode tanpa foto (Islamic & Universal) berhasil di-restore lengkap');
}

// 3. RESTORE ARCHIVED GALLERY PHOTOS (jika ada)
const vaultGallery = path.join(VAULT_DIR, 'gallery-archive');
const targetGallery = path.join(ROOT_DIR, 'images', 'has_photos', 'final', 'gallery');

if (fs.existsSync(vaultGallery)) {
  ['portrait', 'landscape'].forEach(sub => {
    const subVault = path.join(vaultGallery, sub);
    const subTarget = path.join(targetGallery, sub);
    if (fs.existsSync(subVault)) {
      fs.mkdirSync(subTarget, { recursive: true });
      fs.cpSync(subVault, subTarget, { recursive: true });
    }
  });
  console.log('✓ Foto galeri yang sebelumnya dipangkas berhasil dikembalikan ke folder final/gallery');
}

// 4. RESTORE ARCHIVED RAW PHOTOS (jika ada)
const vaultRaw = path.join(VAULT_DIR, 'raw-archive');
const targetRaw = path.join(ROOT_DIR, 'images', 'has_photos', 'raw');

if (fs.existsSync(vaultRaw)) {
  ['profile', 'cover', 'couple', 'gallery'].forEach(sub => {
    const subVault = path.join(vaultRaw, sub);
    const subTarget = path.join(targetRaw, sub);
    if (fs.existsSync(subVault)) {
      fs.mkdirSync(subTarget, { recursive: true });
      fs.cpSync(subVault, subTarget, { recursive: true });
    }
  });
  console.log('✓ File foto raw yang tersimpan di vault berhasil dikembalikan');
}

// 5. REBUILD TAILWIND CSS
console.log('\n🎨 Membangun ulang Tailwind CSS (Mode Normal)...');
try {
  execSync('npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css', {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });
  console.log('✓ output.css berhasil di-build ulang');
} catch (err) {
  console.warn('⚠️ Gagal me-rebuild Tailwind CSS: ' + err.message);
}

console.log('\n✨ SEMPURNA! Template telah dikembalikan ke kondisi awal (Master).');
console.log('   Sekarang Anda dapat membuat atau mengkonfigurasi undangan baru untuk klien berikutnya!\n');
