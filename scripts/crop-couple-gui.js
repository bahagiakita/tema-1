/**
 * ============================================================
 * 💍 BahagiaKita — Interactive Visual Cropper GUI (Option B)
 * ============================================================
 * 
 * Membuka antarmuka web lokal ringan (0-dependency) di browser:
 * - Menampilkan foto berdua dengan 2 lingkaran target interaktif
 * - 🤵 Lingkaran Mempelai Pria (Bisa digeser & diatur ukurannya)
 * - 👰 Lingkaran Mempelai Wanita (Bisa digeser & diatur ukurannya)
 * - Live circular preview real-time
 * - Tombol sekali klik "Simpan & Terapkan"
 * 
 * Penggunaan:
 *   npm run couple:crop
 *   atau ./crop-couple-photo.sh
 * ============================================================
 */

const http = require('http');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const HAS_PHOTOS_DIR = path.join(ROOT_DIR, 'images', 'has_photos');
const RAW_DIR = path.join(HAS_PHOTOS_DIR, 'raw');
const RAW_COUPLE_DIR = path.join(RAW_DIR, 'couple');

const FINAL_DIR = path.join(HAS_PHOTOS_DIR, 'final');
const DEST_PROFILE_DIR = path.join(FINAL_DIR, 'profile');
const DEST_COVER_DIR = path.join(FINAL_DIR, 'cover');
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

function findCoupleImage() {
  ensureDirSync(RAW_DIR);
  ensureDirSync(RAW_COUPLE_DIR);

  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (args.length > 0 && fs.existsSync(args[0])) {
    return path.resolve(args[0]);
  }

  if (fs.existsSync(RAW_COUPLE_DIR)) {
    const coupleFiles = fs.readdirSync(RAW_COUPLE_DIR).filter(isImageFile).sort();
    if (coupleFiles.length > 0) {
      return path.join(RAW_COUPLE_DIR, coupleFiles[0]);
    }
  }

  if (fs.existsSync(RAW_DIR)) {
    const rootFiles = fs.readdirSync(RAW_DIR).filter((f) => {
      const full = path.join(RAW_DIR, f);
      return fs.statSync(full).isFile() && isImageFile(f);
    }).sort();

    const coupleMatch = rootFiles.find((f) => /couple|berdua|pasangan|duo|dua/i.test(f));
    if (coupleMatch) {
      return path.join(RAW_DIR, coupleMatch);
    }
    if (rootFiles.length === 1) {
      return path.join(RAW_DIR, rootFiles[0]);
    }
  }

  return null;
}

function updateWeddingConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return false;
  let content = fs.readFileSync(CONFIG_PATH, 'utf8');

  content = content.replace(/hasPhotos:\s*(false|true),/, 'hasPhotos: true,');
  content = content.replace(/(coverImage:\s*")([^"]*)(")/, '$1./images/has_photos/final/cover/cover.webp$3');
  content = content.replace(/(openGraph:\s*\{[\s\S]*?image:\s*")([^"]*)(")/, '$1./images/has_photos/final/cover/cover.webp$3');
  content = content.replace(/(twitter:\s*\{[\s\S]*?image:\s*")([^"]*)(")/, '$1./images/has_photos/final/cover/cover.webp$3');
  content = content.replace(/(slideshowImages:\s*\[)([\s\S]*?)(\])/, '$1\n      "./images/has_photos/final/cover/cover.webp"\n    $3');
  content = content.replace(/(pria:\s*\{[\s\S]*?photo:\s*")([^"]*)(")/, '$1./images/has_photos/final/profile/pria.webp$3');
  content = content.replace(/(wanita:\s*\{[\s\S]*?photo:\s*")([^"]*)(")/, '$1./images/has_photos/final/profile/wanita.webp$3');

  fs.writeFileSync(CONFIG_PATH, content, 'utf8');
  return true;
}

function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' :
    process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} ${url}`, (err) => {
    if (err) {
      console.log(`\n👉 Silakan buka browser Anda di: ${url}`);
    }
  });
}

function getHTMLPage(fileName, width, height) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Couple Cropper — BahagiaKita</title>
  <style>
    :root {
      --bg-dark: #121513;
      --panel-bg: #1c211e;
      --accent-green: #4ade80;
      --accent-blue: #38bdf8;
      --accent-pink: #f43f5e;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --border-color: #2e3832;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg-dark); color: var(--text-main); display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    
    header {
      background: var(--panel-bg);
      border-bottom: 1px solid var(--border-color);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 17px; }
    .brand span { color: var(--accent-green); }
    .header-actions { display: flex; gap: 12px; align-items: center; }
    .btn {
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-secondary { background: #2a332e; color: #e5e7eb; }
    .btn-secondary:hover { background: #37433c; }
    .btn-primary { background: #16a34a; color: white; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4); }
    .btn-primary:hover { background: #15803d; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .canvas-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #090b0a;
      overflow: hidden;
      user-select: none;
    }
    #crop-stage {
      position: relative;
      display: inline-block;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      border-radius: 4px;
      overflow: hidden;
    }
    #source-img {
      display: block;
      max-width: calc(100vw - 380px);
      max-height: calc(100vh - 120px);
      user-select: none;
      pointer-events: none;
    }
    .crop-ring {
      position: absolute;
      border-radius: 50%;
      cursor: move;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }
    .crop-ring.groom {
      border: 3px solid var(--accent-blue);
    }
    .crop-ring.bride {
      border: 3px solid var(--accent-pink);
    }
    .ring-label {
      position: absolute;
      top: -28px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }
    .crop-ring.groom .ring-label { background: var(--accent-blue); color: #082f49; }
    .crop-ring.bride .ring-label { background: var(--accent-pink); color: #4c0519; }
    
    .resize-handle {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      right: 5px;
      bottom: 5px;
      cursor: nwse-resize;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
    }

    /* Sidebar Previews */
    aside {
      width: 340px;
      background: var(--panel-bg);
      border-left: 1px solid var(--border-color);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
    }
    .sidebar-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    .preview-card {
      background: #141816;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .preview-avatar {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid;
      background: #000;
      flex-shrink: 0;
    }
    .preview-avatar.groom { border-color: var(--accent-blue); }
    .preview-avatar.bride { border-color: var(--accent-pink); }
    .preview-avatar canvas { width: 100%; height: 100%; object-fit: cover; }
    .preview-info h4 { font-size: 15px; margin-bottom: 3px; }
    .preview-info p { font-size: 12px; color: var(--text-muted); line-height: 1.4; }

    .control-group {
      background: #141816;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 14px;
    }
    .control-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted); }
    .slider-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .slider-row span { font-size: 12px; min-width: 60px; }
    .slider-row input[type="range"] { flex: 1; accent-color: var(--accent-green); }

    .tips-box {
      font-size: 12px;
      line-height: 1.5;
      color: var(--text-muted);
      background: rgba(74, 222, 128, 0.05);
      border: 1px dashed rgba(74, 222, 128, 0.3);
      padding: 12px;
      border-radius: 8px;
    }

    /* Success Overlay */
    #success-modal {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }
    .modal-box {
      background: var(--panel-bg);
      border: 1px solid var(--accent-green);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      max-width: 440px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    }
    .modal-icon { font-size: 48px; margin-bottom: 16px; }
    .modal-box h3 { font-size: 20px; color: white; margin-bottom: 8px; }
    .modal-box p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span>💍 BahagiaKita</span> Visual Couple Cropper
    </div>
    <div class="header-actions">
      <button id="swap-btn" class="btn btn-secondary">⇄ Tukar Pria / Wanita</button>
      <button id="reset-btn" class="btn btn-secondary">↺ Reset Posisi</button>
      <button id="save-btn" class="btn btn-primary">✨ Simpan & Terapkan ke Undangan</button>
    </div>
  </header>

  <main>
    <div class="canvas-container">
      <div id="crop-stage">
        <img id="source-img" src="/image" alt="Couple Raw Photo" crossorigin="anonymous">
        
        <!-- Groom Ring -->
        <div id="ring-groom" class="crop-ring groom">
          <span class="ring-label">🤵 Mempelai Pria</span>
          <div class="resize-handle" data-target="groom"></div>
        </div>

        <!-- Bride Ring -->
        <div id="ring-bride" class="crop-ring bride">
          <span class="ring-label">👰 Mempelai Wanita</span>
          <div class="resize-handle" data-target="bride"></div>
        </div>
      </div>
    </div>

    <aside>
      <div class="sidebar-title">Live Preview Undangan</div>

      <!-- Pria Preview -->
      <div class="preview-card">
        <div class="preview-avatar groom">
          <canvas id="canvas-groom" width="140" height="140"></canvas>
        </div>
        <div class="preview-info">
          <h4 id="label-groom-name">Mempelai Pria</h4>
          <p>Ukuran profil bulat 1:1<br>(700 × 700 px WebP)</p>
        </div>
      </div>

      <!-- Wanita Preview -->
      <div class="preview-card">
        <div class="preview-avatar bride">
          <canvas id="canvas-bride" width="140" height="140"></canvas>
        </div>
        <div class="preview-info">
          <h4 id="label-bride-name">Mempelai Wanita</h4>
          <p>Ukuran profil bulat 1:1<br>(700 × 700 px WebP)</p>
        </div>
      </div>

      <!-- Zoom Sliders -->
      <div class="control-group">
        <label>Ukuran Lingkaran (Zoom Wajah):</label>
        <div class="slider-row">
          <span>🤵 Pria:</span>
          <input id="slider-groom" type="range" min="30" max="250" value="80">
        </div>
        <div class="slider-row">
          <span>👰 Wanita:</span>
          <input id="slider-bride" type="range" min="30" max="250" value="80">
        </div>
      </div>

      <div class="tips-box">
        💡 <strong>Tips Framing:</strong><br>
        • Tarik lingkaran langsung dengan mouse/touch.<br>
        • Sisakan ruang di atas rambut dan sedikit bahu agar foto profil terlihat anggun dan proporsional.
      </div>
    </aside>
  </main>

  <!-- Success Modal -->
  <div id="success-modal">
    <div class="modal-box">
      <div class="modal-icon">🎉</div>
      <h3>Berhasil Diproses & Diterapkan!</h3>
      <p>Foto Cover, Profil Pria, dan Profil Wanita telah diperbarui ke format WebP teroptimasi.<br>Konfigurasi <code>wedding-config.js</code> otomatis aktif.</p>
      <button class="btn btn-primary" onclick="window.close();">Tutup Halaman Ini</button>
    </div>
  </div>

  <script>
    const img = document.getElementById('source-img');
    const stage = document.getElementById('crop-stage');
    const ringGroom = document.getElementById('ring-groom');
    const ringBride = document.getElementById('ring-bride');
    const sliderGroom = document.getElementById('slider-groom');
    const sliderBride = document.getElementById('slider-bride');
    const canvasGroom = document.getElementById('canvas-groom');
    const canvasBride = document.getElementById('canvas-bride');
    const swapBtn = document.getElementById('swap-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    const modal = document.getElementById('success-modal');

    // Natural dimensions
    const NAT_W = ${width};
    const NAT_H = ${height};

    // State positions (in stage pixel units)
    let groom = { x: 0, y: 0, r: 80 };
    let bride = { x: 0, y: 0, r: 80 };
    let isSwapped = false;

    function initPositions() {
      const stageW = img.clientWidth;
      const stageH = img.clientHeight;

      const baseR = Math.round(stageW * 0.16);
      groom.r = baseR;
      bride.r = baseR;

      sliderGroom.min = Math.round(stageW * 0.06);
      sliderGroom.max = Math.round(stageW * 0.35);
      sliderGroom.value = baseR;

      sliderBride.min = Math.round(stageW * 0.06);
      sliderBride.max = Math.round(stageW * 0.35);
      sliderBride.value = baseR;

      if (!isSwapped) {
        groom.x = Math.round(stageW * 0.34);
        groom.y = Math.round(stageH * 0.38);
        bride.x = Math.round(stageW * 0.66);
        bride.y = Math.round(stageH * 0.38);
      } else {
        bride.x = Math.round(stageW * 0.34);
        bride.y = Math.round(stageH * 0.38);
        groom.x = Math.round(stageW * 0.66);
        groom.y = Math.round(stageH * 0.38);
      }

      applyRingStyles();
      updatePreviews();
    }

    function applyRingStyles() {
      // Groom
      ringGroom.style.width = (groom.r * 2) + 'px';
      ringGroom.style.height = (groom.r * 2) + 'px';
      ringGroom.style.left = (groom.x - groom.r) + 'px';
      ringGroom.style.top = (groom.y - groom.r) + 'px';

      // Bride
      ringBride.style.width = (bride.r * 2) + 'px';
      ringBride.style.height = (bride.r * 2) + 'px';
      ringBride.style.left = (bride.x - bride.r) + 'px';
      ringBride.style.top = (bride.y - bride.r) + 'px';
    }

    function updatePreviews() {
      const stageW = img.clientWidth;
      const stageH = img.clientHeight;
      if (!stageW || !stageH) return;

      const scaleX = NAT_W / stageW;
      const scaleY = NAT_H / stageH;

      drawPreview(canvasGroom, groom, scaleX, scaleY);
      drawPreview(canvasBride, bride, scaleX, scaleY);
    }

    function drawPreview(canvas, target, scaleX, scaleY) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const srcX = (target.x - target.r) * scaleX;
      const srcY = (target.y - target.r) * scaleY;
      const srcSize = (target.r * 2) * scaleX;

      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // Dragging Logic
    let activeDrag = null; // 'groom', 'bride', 'resize-groom', 'resize-bride'
    let dragStart = { x: 0, y: 0 };
    let initialObj = null;

    function setupDrag(element, targetKey) {
      element.addEventListener('pointerdown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
          activeDrag = 'resize-' + targetKey;
        } else {
          activeDrag = targetKey;
        }
        dragStart = { x: e.clientX, y: e.clientY };
        initialObj = targetKey === 'groom' ? { ...groom } : { ...bride };
        element.setPointerCapture(e.pointerId);
        e.stopPropagation();
      });
    }

    setupDrag(ringGroom, 'groom');
    setupDrag(ringBride, 'bride');

    window.addEventListener('pointermove', (e) => {
      if (!activeDrag) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      const stageW = img.clientWidth;
      const stageH = img.clientHeight;

      if (activeDrag === 'groom') {
        groom.x = Math.max(groom.r, Math.min(stageW - groom.r, initialObj.x + dx));
        groom.y = Math.max(groom.r, Math.min(stageH - groom.r, initialObj.y + dy));
      } else if (activeDrag === 'bride') {
        bride.x = Math.max(bride.r, Math.min(stageW - bride.r, initialObj.x + dx));
        bride.y = Math.max(bride.r, Math.min(stageH - bride.r, initialObj.y + dy));
      } else if (activeDrag === 'resize-groom') {
        const newR = Math.max(20, Math.min(stageW / 2, initialObj.r + (dx + dy) / 2));
        groom.r = Math.round(newR);
        sliderGroom.value = groom.r;
      } else if (activeDrag === 'resize-bride') {
        const newR = Math.max(20, Math.min(stageW / 2, initialObj.r + (dx + dy) / 2));
        bride.r = Math.round(newR);
        sliderBride.value = bride.r;
      }

      applyRingStyles();
      updatePreviews();
    });

    window.addEventListener('pointerup', () => {
      activeDrag = null;
    });

    // Slider inputs
    sliderGroom.addEventListener('input', (e) => {
      groom.r = parseInt(e.target.value, 10);
      applyRingStyles();
      updatePreviews();
    });

    sliderBride.addEventListener('input', (e) => {
      bride.r = parseInt(e.target.value, 10);
      applyRingStyles();
      updatePreviews();
    });

    // Swap button
    swapBtn.addEventListener('click', () => {
      isSwapped = !isSwapped;
      const tempX = groom.x;
      const tempY = groom.y;
      const tempR = groom.r;

      groom.x = bride.x;
      groom.y = bride.y;
      groom.r = bride.r;

      bride.x = tempX;
      bride.y = tempY;
      bride.r = tempR;

      sliderGroom.value = groom.r;
      sliderBride.value = bride.r;

      applyRingStyles();
      updatePreviews();
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
      isSwapped = false;
      initPositions();
    });

    // Save Button
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '⏳ Memproses Crop...';

      const stageW = img.clientWidth;
      const stageH = img.clientHeight;
      const scaleX = NAT_W / stageW;
      const scaleY = NAT_H / stageH;

      const payload = {
        groom: {
          cx: Math.round(groom.x * scaleX),
          cy: Math.round(groom.y * scaleY),
          r: Math.round(groom.r * scaleX)
        },
        bride: {
          cx: Math.round(bride.x * scaleX),
          cy: Math.round(bride.y * scaleY),
          r: Math.round(bride.r * scaleX)
        }
      };

      try {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          modal.style.display = 'flex';
        } else {
          alert('Gagal memproses gambar: ' + (data.error || 'Unknown error'));
          saveBtn.disabled = false;
          saveBtn.innerHTML = '✨ Simpan & Terapkan ke Undangan';
        }
      } catch (err) {
        alert('Error: ' + err.message);
        saveBtn.disabled = false;
        saveBtn.innerHTML = '✨ Simpan & Terapkan ke Undangan';
      }
    });

    img.onload = () => {
      initPositions();
    };
    if (img.complete) {
      initPositions();
    }
  </script>
</body>
</html>`;
}

async function startServer(imagePath) {
  const meta = await sharp(imagePath).rotate().metadata();
  const natW = meta.width;
  const natH = meta.height;

  const server = http.createServer(async (req, res) => {
    // 1. GET /image
    if (req.url === '/image') {
      const ext = path.extname(imagePath).toLowerCase();
      let contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';

      // Pipe image (dengan rotate EXIF)
      res.writeHead(200, { 'Content-Type': contentType });
      sharp(imagePath).rotate().pipe(res);
      return;
    }

    // 2. POST /api/save
    if (req.url === '/api/save' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', async () => {
        try {
          const { groom, bride } = JSON.parse(body);

          ensureDirSync(DEST_PROFILE_DIR);
          ensureDirSync(DEST_COVER_DIR);

          // 1. Save Cover
          const coverPath = path.join(DEST_COVER_DIR, 'cover.webp');
          await sharp(imagePath)
            .rotate()
            .resize(800, 1200, { fit: 'cover', position: sharp.strategy.attention })
            .webp({ quality: 85, effort: 6 })
            .toFile(coverPath);

          // 2. Crop Groom
          const groomDiameter = groom.r * 2;
          let gLeft = Math.max(0, groom.cx - groom.r);
          let gTop = Math.max(0, groom.cy - groom.r);
          let gWidth = Math.min(groomDiameter, natW - gLeft);
          let gHeight = Math.min(groomDiameter, natH - gTop);
          const gSize = Math.min(gWidth, gHeight);

          const groomPath = path.join(DEST_PROFILE_DIR, 'pria.webp');
          await sharp(imagePath)
            .rotate()
            .extract({ left: gLeft, top: gTop, width: gSize, height: gSize })
            .resize(700, 700, { fit: 'cover' })
            .webp({ quality: 85, effort: 6 })
            .toFile(groomPath);

          // 3. Crop Bride
          const brideDiameter = bride.r * 2;
          let bLeft = Math.max(0, bride.cx - bride.r);
          let bTop = Math.max(0, bride.cy - bride.r);
          let bWidth = Math.min(brideDiameter, natW - bLeft);
          let bHeight = Math.min(brideDiameter, natH - bTop);
          const bSize = Math.min(bWidth, bHeight);

          const bridePath = path.join(DEST_PROFILE_DIR, 'wanita.webp');
          await sharp(imagePath)
            .rotate()
            .extract({ left: bLeft, top: bTop, width: bSize, height: bSize })
            .resize(700, 700, { fit: 'cover' })
            .webp({ quality: 85, effort: 6 })
            .toFile(bridePath);

          // 4. Update wedding-config.js
          updateWeddingConfig();

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));

          console.log('\n============================================================');
          console.log(' 🎉 CROPPING VISUAL BERHASIL DISIMPAN!');
          console.log('============================================================');
          console.log(` • Cover Utama   : images/has_photos/final/cover/cover.webp (${formatBytes(fs.statSync(coverPath).size)})`);
          console.log(` • Profil Pria   : images/has_photos/final/profile/pria.webp (${formatBytes(fs.statSync(groomPath).size)})`);
          console.log(` • Profil Wanita : images/has_photos/final/profile/wanita.webp (${formatBytes(fs.statSync(bridePath).size)})`);
          console.log(` • Config        : wedding-config.js otomatis diperbarui (hasPhotos: true)`);
          console.log('------------------------------------------------------------');
          console.log(' Tekan [ Ctrl + Shift + R ] di browser undangan Anda untuk melihat hasil!');
          console.log('============================================================\n');

          setTimeout(() => {
            server.close();
            process.exit(0);
          }, 1500);

        } catch (err) {
          console.error('Error saving crops:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    // 3. GET / (HTML Page)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(getHTMLPage(path.basename(imagePath), natW, natH));
  });

  const PORT = 5566;
  server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log('\n============================================================');
    console.log(' 🎨 BAHAGIAKITA — INTERACTIVE VISUAL COUPLE CROPPER');
    console.log('============================================================');
    console.log(` 📸 Foto Sumber  : ${path.relative(ROOT_DIR, imagePath)} (${natW}x${natH} px)`);
    console.log(` 🌐 Buka Browser : ${url}`);
    console.log('------------------------------------------------------------');
    console.log(' 💡 Geser lingkaran Pria & Wanita langsung di layar browser Anda,');
    console.log('    lalu klik tombol "Simpan & Terapkan".');
    console.log('============================================================\n');

    openBrowser(url);
  });
}

function main() {
  const coupleImg = findCoupleImage();

  if (!coupleImg) {
    console.log('\n============================================================');
    console.log(' 🎨 BAHAGIAKITA — INTERACTIVE VISUAL COUPLE CROPPER');
    console.log('============================================================');
    console.log('⚠️ Tidak ada foto berdua ditemukan di folder raw!');
    console.log('\n📌 Cara Menggunakan:');
    console.log('   1. Masukkan 1 foto berdua ke:');
    console.log('      images/has_photos/raw/couple/ (contoh: couple.jpg)');
    console.log('   2. Jalankan perintah: npm run couple:crop\n');
    process.exit(0);
  }

  startServer(coupleImg).catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}

main();
