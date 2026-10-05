const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_DIR = path.join(ROOT_DIR, 'images', 'no_photos');
const SAMPLE_DIR = path.join(DEFAULT_DIR, 'sample');

async function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function processImages() {
  console.log('🚀 Memulai konversi dan penataan ulang seluruh aset default (Islamic & Universal)...');

  const categories = [
    { srcName: 'islam', destName: 'islamic' },
    { srcName: 'universal', destName: 'universal' }
  ];

  for (const cat of categories) {
    const srcDir = path.join(SAMPLE_DIR, cat.srcName);
    const destDir = path.join(DEFAULT_DIR, cat.destName);

    if (!fs.existsSync(srcDir)) {
      console.warn(`⚠️ Folder sumber tidak ditemukan: ${srcDir}`);
      continue;
    }

    console.log(`\n📦 Memproses kategori: [${cat.destName.toUpperCase()}]...`);
    await ensureDir(path.join(destDir, 'profile'));
    await ensureDir(path.join(destDir, 'welcome'));
    await ensureDir(path.join(destDir, 'cover'));
    await ensureDir(path.join(destDir, 'seo'));

    const tasks = [
      {
        name: `Profil Pria (${cat.destName})`,
        input: path.join(srcDir, 'pria.png'),
        outputs: [path.join(destDir, 'profile', 'pria.webp')],
        width: 700,
        height: 700,
        fit: 'cover',
        format: 'webp',
        options: { quality: 85, effort: 6 }
      },
      {
        name: `Profil Wanita (${cat.destName})`,
        input: path.join(srcDir, 'wanita.png'),
        outputs: [path.join(destDir, 'profile', 'wanita.webp')],
        width: 700,
        height: 700,
        fit: 'cover',
        format: 'webp',
        options: { quality: 85, effort: 6 }
      },
      {
        name: `Welcome Main Hero (${cat.destName} - Rectangle/Square)`,
        input: path.join(srcDir, 'main-rectangle.png'),
        outputs: [path.join(destDir, 'welcome', 'main.webp')],
        width: 800,
        height: 800,
        fit: 'cover',
        format: 'webp',
        options: { quality: 85, effort: 6 }
      },
      {
        name: `Cover Background (${cat.destName} - Potrait)`,
        input: path.join(srcDir, 'main-potrait.png'),
        outputs: [path.join(destDir, 'cover', 'cover.webp')],
        width: 800,
        height: 1200,
        fit: 'cover',
        format: 'webp',
        options: { quality: 85, effort: 6 }
      },
      {
        name: `Social Share / OG JPG (${cat.destName})`,
        input: path.join(srcDir, 'og-image.png'),
        outputs: [path.join(destDir, 'seo', 'og-image.jpg')],
        width: 1200,
        height: 630,
        fit: 'cover',
        format: 'jpeg',
        options: { quality: 85, mozjpeg: true }
      },
      {
        name: `Social Share / OG WebP (${cat.destName})`,
        input: path.join(srcDir, 'og-image.png'),
        outputs: [path.join(destDir, 'seo', 'og-image.webp')],
        width: 1200,
        height: 630,
        fit: 'cover',
        format: 'webp',
        options: { quality: 85, effort: 6 }
      }
    ];

    for (const task of tasks) {
      if (!fs.existsSync(task.input)) {
        console.warn(`  ⚠️ Input tidak ditemukan: ${task.input}`);
        continue;
      }

      const startStat = fs.statSync(task.input);
      let pipeline = sharp(task.input);

      if (task.width && task.height) {
        pipeline = pipeline.resize(task.width, task.height, {
          fit: task.fit || 'cover',
          position: 'center'
        });
      }

      if (task.format === 'webp') {
        pipeline = pipeline.webp(task.options);
      } else if (task.format === 'jpeg') {
        pipeline = pipeline.jpeg(task.options);
      }

      const buffer = await pipeline.toBuffer();
      for (const outPath of task.outputs) {
        await ensureDir(path.dirname(outPath));
        fs.writeFileSync(outPath, buffer);
      }

      const savedPercent = (((startStat.size - buffer.length) / startStat.size) * 100).toFixed(1);
      console.log(`  ✅ [${task.name}]`);
      console.log(`     Asal: ${(startStat.size / 1024).toFixed(1)} KB -> Hasil: ${(buffer.length / 1024).toFixed(1)} KB (Hemat ${savedPercent}%)`);
      console.log(`     Output: ${task.outputs.map(p => path.relative(ROOT_DIR, p)).join(', ')}`);
    }
  }

  console.log('\n🎉 Seluruh gambar default (Islamic & Universal) berhasil dikonversi dan ditata rapi!');
}

processImages().catch(err => {
  console.error('❌ Error memproses gambar:', err);
  process.exit(1);
});
