/**
 * scripts/download-and-optimize-logos.js
 * 
 * Script otomatis untuk mengunduh, menstandarisasi, dan mengompresi
 * logo-logo bank & dompet digital terpopuler di Indonesia menggunakan Sharp.
 * 
 * Target direktori:
 * - images/logo/sample/svg/ : File vektor SVG sumber
 * - images/logo/sample/     : File PNG hasil kompresi untuk sample
 * - images/logo/            : File PNG produksi siap pakai pada template
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const BASE_URL = 'https://raw.githubusercontent.com/hafidznoor/idn-finlogos/main/Sources/IdnFinLogos/Icons/';

const LOGOS = [
  // --- Bank BUMN & Swasta Terbesar ---
  { id: 'bca', name: 'Bank Central Asia (BCA)', file: 'bca.svg', category: 'Bank Konvensional' },
  { id: 'mandiri', name: 'Bank Mandiri', file: 'mandiri.svg', category: 'Bank Konvensional' },
  { id: 'bri', name: 'Bank BRI', file: 'bri.svg', category: 'Bank Konvensional' },
  { id: 'bni', name: 'Bank BNI', file: 'bni.svg', category: 'Bank Konvensional' },
  { id: 'btn', name: 'Bank BTN', file: 'btn.svg', category: 'Bank Konvensional' },
  { id: 'cimb', name: 'Bank CIMB Niaga', file: 'cimb-niaga.svg', category: 'Bank Konvensional' },
  { id: 'permata', name: 'Bank Permata', file: 'permata.svg', category: 'Bank Konvensional' },
  { id: 'danamon', name: 'Bank Danamon', file: 'danamon.svg', category: 'Bank Konvensional' },
  { id: 'panin', name: 'Bank Panin', file: 'paninbank.svg', category: 'Bank Konvensional' },
  { id: 'mega', name: 'Bank Mega', file: 'mega.svg', category: 'Bank Konvensional' },
  { id: 'maybank', name: 'Bank Maybank Indonesia', file: 'maybank.svg', category: 'Bank Konvensional' },
  { id: 'ocbc', name: 'Bank OCBC Indonesia', file: 'ocbc-nisp.svg', category: 'Bank Konvensional' },
  { id: 'sinarmas', name: 'Bank Sinarmas', file: 'sinarmas.svg', category: 'Bank Konvensional' },
  { id: 'uob', name: 'Bank UOB Indonesia', file: 'uob.svg', category: 'Bank Konvensional' },

  // --- Bank Syariah ---
  { id: 'bsi', name: 'Bank Syariah Indonesia (BSI)', file: 'bsi.svg', category: 'Bank Syariah' },
  { id: 'muamalat', name: 'Bank Muamalat Indonesia', file: 'muamalat.svg', category: 'Bank Syariah' },
  { id: 'bca-syariah', name: 'BCA Syariah', file: 'bca-syariah.svg', category: 'Bank Syariah' },
  { id: 'aladin', name: 'Bank Aladin Syariah', file: 'aladin.svg', category: 'Bank Syariah' },

  // --- Bank Digital & Neobank ---
  { id: 'jago', name: 'Bank Jago', file: 'jago.svg', category: 'Bank Digital' },
  { id: 'seabank', name: 'SeaBank Indonesia', file: 'seabank.svg', category: 'Bank Digital' },
  { id: 'jenius', name: 'Jenius (BTPN)', file: 'jenius.svg', category: 'Bank Digital' },
  { id: 'blu', name: 'blu by BCA Digital', file: 'blu-bca.svg', category: 'Bank Digital' },
  { id: 'allo', name: 'Allo Bank', file: 'allo.svg', category: 'Bank Digital' },
  { id: 'neobank', name: 'Neobank (BNC)', file: 'neobank.svg', category: 'Bank Digital' },
  { id: 'superbank', name: 'Superbank', file: 'superbank.svg', category: 'Bank Digital' },
  { id: 'line-bank', name: 'LINE Bank', file: 'line-bank.svg', category: 'Bank Digital' },

  // --- Bank Daerah (BPD) ---
  { id: 'bjb', name: 'Bank BJB (Jawa Barat & Banten)', file: 'bank-bjb.svg', category: 'Bank Daerah' },
  { id: 'bank-jateng', name: 'Bank Jateng', file: 'bank-bpd-jateng.svg', category: 'Bank Daerah' },
  { id: 'bank-jatim', name: 'Bank Jatim', file: 'bank-bpd-jatim.svg', category: 'Bank Daerah' },

  // --- E-Wallet & QRIS ---
  { id: 'dana', name: 'DANA', file: 'dana.svg', category: 'E-Wallet & QRIS' },
  { id: 'gopay', name: 'GoPay', file: 'gopay.svg', category: 'E-Wallet & QRIS' },
  { id: 'ovo', name: 'OVO', file: 'ovo.svg', category: 'E-Wallet & QRIS' },
  { id: 'shopeepay', name: 'ShopeePay', file: 'shopee-pay.svg', category: 'E-Wallet & QRIS' },
  { id: 'linkaja', name: 'LinkAja', file: 'linkaja.svg', category: 'E-Wallet & QRIS' },
  { id: 'qris', name: 'QRIS', file: 'qris.svg', category: 'E-Wallet & QRIS' }
];

const DIR_PROD = path.resolve(__dirname, '../images/logo');
const DIR_SAMPLE = path.resolve(__dirname, '../images/logo/sample');
const DIR_SAMPLE_SVG = path.resolve(__dirname, '../images/logo/sample/svg');

// Buat direktori jika belum ada
[DIR_PROD, DIR_SAMPLE, DIR_SAMPLE_SVG].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} - Status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

/**
 * Memproses buffer SVG dengan Sharp:
 * 1. Rasterisasi SVG dengan kerapatan 300 DPI untuk ketajaman retina display.
 * 2. Trim margin kosong di sekeliling logo.
 * 3. Tentukan ukuran target berdasarkan rasio aspek (optical balance formula):
 *    - Wide logo (ratio >= 2.5): max width 340px, max height 150px
 *    - Medium logo (ratio 1.8 - 2.5): max width 300px, max height 180px
 *    - Square/compact logo (ratio < 1.8): max width 240px, max height 240px
 * 4. Posisikan di tengah kanvas transparan standar 400x400 px.
 * 5. Kompresi PNG menggunakan quantisasi palet 8-bit berkualitas tinggi untuk ukuran sangat ringkas (<10KB).
 */
async function processLogo(svgBuffer) {
  const trimmed = await sharp(svgBuffer, { density: 300 })
    .trim()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = trimmed.info;
  const ratio = width / height;

  let targetW, targetH;
  if (ratio >= 2.5) {
    targetW = 340;
    targetH = 150;
  } else if (ratio >= 1.8) {
    targetW = 300;
    targetH = 180;
  } else {
    targetW = 240;
    targetH = 240;
  }

  const resized = await sharp(trimmed.data)
    .resize({ width: targetW, height: targetH, fit: 'inside' })
    .toBuffer();

  const finalPng = await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toBuffer();

  return { finalPng, origWidth: width, origHeight: height, ratio };
}

async function run() {
  console.log(`=======================================================`);
  console.log(`🚀 Mulai mengunduh dan mengompresi ${LOGOS.length} logo bank & e-wallet`);
  console.log(`=======================================================\n`);

  const report = [];

  for (let i = 0; i < LOGOS.length; i++) {
    const item = LOGOS[i];
    const url = BASE_URL + item.file;
    const progress = `[${String(i + 1).padStart(2, '0')}/${LOGOS.length}]`;

    try {
      // 1. Download SVG
      const svgBuffer = await fetchBuffer(url);

      // Simpan file SVG sumber di sample/svg/
      const svgPath = path.join(DIR_SAMPLE_SVG, `${item.id}.svg`);
      fs.writeFileSync(svgPath, svgBuffer);

      // 2. Proses dan kompres dengan Sharp
      const { finalPng, origWidth, origHeight, ratio } = await processLogo(svgBuffer);

      // 3. Simpan PNG di images/logo/sample/ dan images/logo/
      const samplePngPath = path.join(DIR_SAMPLE, `${item.id}.png`);
      const prodPngPath = path.join(DIR_PROD, `${item.id}.png`);

      fs.writeFileSync(samplePngPath, finalPng);
      fs.writeFileSync(prodPngPath, finalPng);

      const sizeKb = (finalPng.length / 1024).toFixed(1);
      console.log(`${progress} ✅ ${item.name.padEnd(32)} -> ${item.id}.png (${sizeKb} KB, ratio ${ratio.toFixed(2)})`);

      report.push({
        id: item.id,
        name: item.name,
        category: item.category,
        filename: `${item.id}.png`,
        path: `./images/logo/${item.id}.png`,
        sizeBytes: finalPng.length,
        sizeKb: sizeKb + ' KB',
        ratio: ratio.toFixed(2),
        status: 'OK'
      });
    } catch (err) {
      console.error(`${progress} ❌ Gagal memproses ${item.name} (${item.file}):`, err.message);
      report.push({
        id: item.id,
        name: item.name,
        category: item.category,
        status: 'FAILED',
        error: err.message
      });
    }
  }

  // Simpan ringkasan katalog logo sebagai JSON di images/logo/sample/catalog.json
  const catalogPath = path.join(DIR_SAMPLE, 'catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(report, null, 2), 'utf8');

  console.log(`\n=======================================================`);
  console.log(`🎉 Selesai! Berhasil memproses ${report.filter(r => r.status === 'OK').length} dari ${LOGOS.length} logo.`);
  console.log(`📁 Lokasi file:`);
  console.log(`   - Sample SVG : images/logo/sample/svg/`);
  console.log(`   - Sample PNG : images/logo/sample/`);
  console.log(`   - Prod PNG   : images/logo/`);
  console.log(`   - Katalog    : images/logo/sample/catalog.json`);
  console.log(`=======================================================`);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
