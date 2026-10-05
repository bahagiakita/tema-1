/**
 * BahagiaKita — Universal Assets Generator
 * Copyright (c) 2025–2026 Yusuf (BahagiaKita). All Rights Reserved.
 * Generates silhouette & default assets for universal (non-photo) weddings.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const UNIVERSAL_DIR = path.join(ROOT_DIR, 'images', 'no_photos', 'universal');

async function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 1. Female Universal SVG (Bride in Wedding Gown & Veil / Non-Hijab)
const femaleSvg = `
<svg width="700" height="700" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF9F5"/>
      <stop offset="100%" stop-color="#EFEBE4"/>
    </linearGradient>
    <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D49A7E"/>
      <stop offset="100%" stop-color="#B87355"/>
    </linearGradient>
    <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F3E5AB"/>
      <stop offset="100%" stop-color="#C5A028"/>
    </linearGradient>
    <filter id="shadowF" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2D4A3E" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background Circle -->
  <circle cx="350" cy="350" r="320" fill="url(#bgGradF)"/>
  <circle cx="350" cy="350" r="300" stroke="url(#goldRing)" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.85"/>
  <circle cx="350" cy="350" r="285" stroke="#7DA268" stroke-width="1.5" opacity="0.4"/>

  <!-- Botanical Leaf Accents -->
  <g opacity="0.85" transform="translate(0, 0)">
    <!-- Top right leaves -->
    <path d="M520,180 C540,150 580,140 600,160 C580,180 550,190 520,180 Z" fill="#7DA268"/>
    <path d="M545,195 C575,185 605,200 615,225 C590,230 560,215 545,195 Z" fill="#60834E"/>
    <path d="M510,215 C535,220 555,240 550,265 C530,255 520,235 510,215 Z" fill="#8EAF7C"/>
    <circle cx="560" cy="165" r="4" fill="#D4AF37"/>
    <circle cx="585" cy="210" r="3.5" fill="#D4AF37"/>

    <!-- Bottom left leaves -->
    <path d="M180,520 C160,550 120,560 100,540 C120,520 150,510 180,520 Z" fill="#7DA268"/>
    <path d="M155,505 C125,515 95,500 85,475 C110,470 140,485 155,505 Z" fill="#60834E"/>
    <path d="M190,485 C165,480 145,460 150,435 C170,445 180,465 190,485 Z" fill="#8EAF7C"/>
    <circle cx="140" cy="535" r="4" fill="#D4AF37"/>
    <circle cx="115" cy="490" r="3.5" fill="#D4AF37"/>
  </g>

  <!-- Bride Silhouette (Updo Hair, Bridal Veil, Elegant Gown) -->
  <g filter="url(#shadowF)" transform="translate(0, 20)">
    <!-- Bridal Veil Flow -->
    <path d="M290,260 C250,300 230,420 220,530 C270,550 350,560 410,540 C430,460 410,340 370,260 Z" fill="#EAE5DC" opacity="0.6"/>
    <path d="M280,280 C240,330 225,450 215,535 C250,550 320,555 370,545 C380,470 370,360 350,280 Z" fill="#F4F0E8" opacity="0.5"/>

    <!-- Bride Body & Gown -->
    <!-- Shoulders & Décolletage -->
    <path d="M250,540 C250,480 280,425 315,405 L315,360 C315,360 305,355 305,335 C305,315 315,310 315,310 C310,290 315,250 345,235 C375,220 400,240 405,265 C415,275 415,305 395,325 C395,340 385,360 385,360 L385,405 C420,425 450,480 450,540 Z" fill="url(#terracottaGrad)"/>

    <!-- Hair Silhouette (Elegant Updo Chignon) -->
    <path d="M330,265 C320,245 330,215 360,210 C390,205 410,225 415,255 C420,285 405,315 385,320 C375,322 365,305 365,295 C365,285 375,275 375,260 C375,245 355,245 345,255 C338,262 335,275 330,265 Z" fill="#8C4F35"/>
    <circle cx="380" cy="235" r="28" fill="#8C4F35"/>

    <!-- Tiara / Hair Vine Accent -->
    <path d="M352,228 Q370,220 392,232" stroke="#D4AF37" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="360" cy="225" r="3" fill="#FFF"/>
    <circle cx="372" cy="222" r="3.5" fill="#D4AF37"/>
    <circle cx="384" cy="227" r="3" fill="#FFF"/>

    <!-- Gown Sweetheart Neckline Detail -->
    <path d="M315,430 C335,450 350,440 350,440 C350,440 365,450 385,430 C405,465 425,510 435,540 L265,540 C275,510 295,465 315,430 Z" fill="#FFFFFF" opacity="0.95"/>
    <path d="M350,440 L350,540" stroke="#E5DFD5" stroke-width="1.5" stroke-dasharray="3 3"/>

    <!-- Floral Neckline Lace -->
    <path d="M315,430 Q335,445 350,438 Q365,445 385,430" stroke="#D4AF37" stroke-width="2" fill="none" opacity="0.7"/>
    <circle cx="350" cy="442" r="3" fill="#D4AF37"/>
  </g>

  <!-- Outer Wreath Accent Base -->
  <path d="M220,600 C280,625 420,625 480,600" stroke="#7DA268" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
  <circle cx="350" cy="615" r="4" fill="#D4AF37"/>
  <circle cx="330" cy="613" r="3" fill="#7DA268"/>
  <circle cx="370" cy="613" r="3" fill="#7DA268"/>
</svg>
`;

// 2. Male Universal SVG (Groom in Tuxedo / Suit & Tie, Modern Hair / Non-Peci)
const maleSvg = `
<svg width="700" height="700" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF9F5"/>
      <stop offset="100%" stop-color="#EFEBE4"/>
    </linearGradient>
    <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#385A4C"/>
      <stop offset="100%" stop-color="#213A30"/>
    </linearGradient>
    <linearGradient id="goldRingM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F3E5AB"/>
      <stop offset="100%" stop-color="#C5A028"/>
    </linearGradient>
    <filter id="shadowM" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2D4A3E" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background Circle -->
  <circle cx="350" cy="350" r="320" fill="url(#bgGradM)"/>
  <circle cx="350" cy="350" r="300" stroke="url(#goldRingM)" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.85"/>
  <circle cx="350" cy="350" r="285" stroke="#7DA268" stroke-width="1.5" opacity="0.4"/>

  <!-- Botanical Leaf Accents -->
  <g opacity="0.85">
    <!-- Top left leaves -->
    <path d="M180,180 C160,150 120,140 100,160 C120,180 150,190 180,180 Z" fill="#7DA268"/>
    <path d="M155,195 C125,185 95,200 85,225 C110,230 140,215 155,195 Z" fill="#60834E"/>
    <path d="M190,215 C165,220 145,240 150,265 C170,255 180,235 190,215 Z" fill="#8EAF7C"/>
    <circle cx="140" cy="165" r="4" fill="#D4AF37"/>
    <circle cx="115" cy="210" r="3.5" fill="#D4AF37"/>

    <!-- Bottom right leaves -->
    <path d="M520,520 C540,550 580,560 600,540 C580,520 550,510 520,520 Z" fill="#7DA268"/>
    <path d="M545,505 C575,515 605,500 615,475 C590,470 560,485 545,505 Z" fill="#60834E"/>
    <path d="M510,485 C535,480 555,460 550,435 C530,445 520,465 510,485 Z" fill="#8EAF7C"/>
    <circle cx="560" cy="535" r="4" fill="#D4AF37"/>
    <circle cx="585" cy="490" r="3.5" fill="#D4AF37"/>
  </g>

  <!-- Groom Silhouette (Modern Haircut, Tuxedo Suit, Shirt & Bow Tie) -->
  <g filter="url(#shadowM)" transform="translate(0, 20)">
    <!-- Head & Neck Base -->
    <path d="M320,360 L320,320 C320,320 305,310 305,285 C305,260 320,250 320,250 C315,220 335,195 365,195 C395,195 415,220 410,250 C410,250 425,260 425,285 C425,310 410,320 410,320 L410,360 Z" fill="#E8DCC8"/>

    <!-- Modern Styled Haircut Silhouette -->
    <path d="M320,250 C315,215 335,185 365,185 C400,185 418,205 415,245 C410,240 400,230 380,230 C355,230 335,245 320,250 Z" fill="#213A30"/>
    <path d="M318,245 C325,225 345,200 375,195 C395,192 410,202 415,215 C410,200 390,190 365,190 C340,190 325,205 318,245 Z" fill="#152620"/>
    <!-- Sideburns -->
    <path d="M320,245 L324,275 L330,270 L328,245 Z" fill="#213A30"/>
    <path d="M410,245 L406,275 L400,270 L402,245 Z" fill="#213A30"/>

    <!-- Suit & Tuxedo Body -->
    <path d="M225,540 C225,460 270,410 320,390 L320,360 L410,360 L410,390 C460,410 505,460 505,540 Z" fill="url(#forestGrad)"/>

    <!-- White Dress Shirt V-Neck -->
    <polygon points="325,360 405,360 365,490" fill="#FFFFFF"/>
    <!-- Shirt Collar Wings -->
    <polygon points="325,360 350,385 340,360" fill="#F0ECE4"/>
    <polygon points="405,360 380,385 390,360" fill="#F0ECE4"/>

    <!-- Tuxedo Bow Tie -->
    <g transform="translate(365, 385)">
      <polygon points="0,0 -20,-10 -20,10" fill="#152620"/>
      <polygon points="0,0 20,-10 20,10" fill="#152620"/>
      <circle cx="0" cy="0" r="5" fill="#D4AF37"/>
    </g>

    <!-- Tuxedo Lapels -->
    <polygon points="320,390 350,470 325,540 250,540 280,450" fill="#1C3028" opacity="0.6"/>
    <polygon points="410,390 380,470 405,540 480,540 450,450" fill="#1C3028" opacity="0.6"/>

    <!-- Boutonnière / Lapel Flower (Earthy Sage & Gold) -->
    <g transform="translate(305, 425)">
      <circle cx="0" cy="0" r="7" fill="#D49A7E"/>
      <circle cx="2" cy="-2" r="4" fill="#F3E5AB"/>
      <path d="M-2,6 C-6,14 -4,20 -2,24" stroke="#7DA268" stroke-width="2" fill="none"/>
      <path d="M-4,12 C-10,10 -12,6 -10,2 C-8,4 -5,8 -4,12 Z" fill="#7DA268"/>
    </g>
  </g>

  <!-- Outer Wreath Accent Base -->
  <path d="M220,600 C280,625 420,625 480,600" stroke="#7DA268" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
  <circle cx="350" cy="615" r="4" fill="#D4AF37"/>
  <circle cx="330" cy="613" r="3" fill="#7DA268"/>
  <circle cx="370" cy="613" r="3" fill="#7DA268"/>
</svg>
`;

// 3. Welcome Main Universal SVG (Couple in Gown & Suit with Floral Wreath)
const mainSvg = `
<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF9F5"/>
      <stop offset="100%" stop-color="#EFEBE4"/>
    </linearGradient>
    <linearGradient id="goldMain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F3E5AB"/>
      <stop offset="100%" stop-color="#C5A028"/>
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="800" fill="url(#bgGradMain)"/>
  <circle cx="400" cy="400" r="360" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="400" cy="400" r="340" stroke="url(#goldMain)" stroke-width="2" stroke-dasharray="8 6"/>
  <circle cx="400" cy="400" r="325" stroke="#7DA268" stroke-width="1.5" opacity="0.5"/>

  <!-- Botanical Wreath Frame -->
  <g transform="translate(400, 400)">
    <!-- Top Arc Foliage -->
    <path d="M-220,-200 C-100,-330 100,-330 220,-200" stroke="#7DA268" stroke-width="2" fill="none"/>
    <!-- Bottom Arc Foliage -->
    <path d="M-220,200 C-100,330 100,330 220,200" stroke="#7DA268" stroke-width="2" fill="none"/>
  </g>

  <!-- Couple Silhouette Together (Groom Tuxedo + Bride Gown & Veil) -->
  <g transform="translate(400, 410) scale(0.95)">
    <!-- Groom (Left side) -->
    <g transform="translate(-55, -40)">
      <path d="M-40,160 C-40,100 0,60 30,50 L30,20 C30,20 40,20 40,0 C40,-20 30,-30 30,-30 C35,-55 20,-75 -5,-75 C-30,-75 -45,-55 -40,-30 C-40,-30 -50,-20 -50,0 C-50,20 -40,20 -40,20 L-40,50 C-70,60 -100,100 -100,160 Z" fill="#213A30"/>
      <!-- Groom modern hair -->
      <path d="M-45,-35 C-50,-65 -30,-80 -5,-80 C20,-80 35,-65 30,-35 C25,-40 15,-50 0,-50 C-20,-50 -35,-40 -45,-35 Z" fill="#152620"/>
      <!-- White shirt & bow tie -->
      <polygon points="-15,45 15,45 0,110" fill="#FFF"/>
      <circle cx="0" cy="55" r="4" fill="#D4AF37"/>
    </g>

    <!-- Bride (Right side) -->
    <g transform="translate(55, -20)">
      <!-- Bridal Veil -->
      <path d="M-10,-50 C-40,-10 -60,80 -70,160 C-30,170 30,175 80,160 C90,80 70,-10 40,-50 Z" fill="#EAE5DC" opacity="0.6"/>
      <!-- Bride Body & Gown -->
      <path d="M-50,160 C-50,110 -25,70 5,50 L5,20 C5,20 -5,15 -5,-5 C-5,-25 5,-30 5,-30 C0,-50 15,-75 40,-75 C65,-75 80,-50 75,-30 C75,-30 85,-25 85,-5 C85,15 75,20 75,20 L75,50 C105,70 130,110 130,160 Z" fill="#B87355"/>
      <!-- Hair Chignon Updo -->
      <circle cx="45" cy="-55" r="24" fill="#8C4F35"/>
      <path d="M22,-50 Q40,-60 58,-48" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
      <!-- White Gown Overlay -->
      <path d="M5,65 C20,80 35,75 35,75 C35,75 50,80 65,65 C85,95 105,130 115,160 L-35,160 C-25,130 -5,95 5,65 Z" fill="#FFFFFF" opacity="0.95"/>
    </g>

    <!-- Shared Bridal Bouquet (Terracotta, Sage & Cream) -->
    <g transform="translate(0, 70)">
      <circle cx="0" cy="0" r="16" fill="#D49A7E"/>
      <circle cx="-10" cy="-6" r="12" fill="#7DA268"/>
      <circle cx="10" cy="-6" r="12" fill="#F3E5AB"/>
      <circle cx="0" cy="-12" r="10" fill="#B87355"/>
      <circle cx="-6" cy="8" r="8" fill="#8EAF7C"/>
      <circle cx="6" cy="8" r="8" fill="#D4AF37"/>
      <!-- Ribbon trail -->
      <path d="M0,12 C-5,25 -2,40 -4,55" stroke="#D4AF37" stroke-width="2" fill="none"/>
      <path d="M0,12 C5,25 2,40 4,55" stroke="#D4AF37" stroke-width="2" fill="none"/>
    </g>
  </g>

  <!-- Typography Banner Below -->
  <text x="400" y="670" font-family="'Playfair Display', Georgia, serif" font-size="28" font-style="italic" fill="#2D4A3E" text-anchor="middle" letter-spacing="2">The Wedding Celebration</text>
  <text x="400" y="705" font-family="'Poppins', sans-serif" font-size="13" font-weight="500" fill="#7DA268" text-anchor="middle" letter-spacing="4">EARTHY BOTANICAL</text>
</svg>
`;

// 4. Social Share OG Image SVG (1200 x 630 px)
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F5"/>
      <stop offset="100%" stop-color="#EBE5DC"/>
    </linearGradient>
    <linearGradient id="goldOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F3E5AB"/>
      <stop offset="100%" stop-color="#C5A028"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgOg)"/>

  <!-- Elegant Inner Border -->
  <rect x="30" y="30" width="1140" height="570" rx="16" stroke="url(#goldOg)" stroke-width="2" fill="none"/>
  <rect x="42" y="42" width="1116" height="546" rx="10" stroke="#7DA268" stroke-width="1.5" stroke-dasharray="8 6" fill="none" opacity="0.6"/>

  <!-- Corner Botanical Flourishes -->
  <!-- Top-Left -->
  <g transform="translate(60, 60)">
    <path d="M0,0 C30,10 60,30 80,60 C50,60 20,40 0,0 Z" fill="#7DA268"/>
    <path d="M0,0 C10,30 30,60 60,80 C60,50 40,20 0,0 Z" fill="#60834E"/>
    <circle cx="45" cy="45" r="4" fill="#D4AF37"/>
  </g>
  <!-- Top-Right -->
  <g transform="translate(1140, 60) scale(-1, 1)">
    <path d="M0,0 C30,10 60,30 80,60 C50,60 20,40 0,0 Z" fill="#7DA268"/>
    <path d="M0,0 C10,30 30,60 60,80 C60,50 40,20 0,0 Z" fill="#60834E"/>
    <circle cx="45" cy="45" r="4" fill="#D4AF37"/>
  </g>
  <!-- Bottom-Left -->
  <g transform="translate(60, 570) scale(1, -1)">
    <path d="M0,0 C30,10 60,30 80,60 C50,60 20,40 0,0 Z" fill="#7DA268"/>
    <path d="M0,0 C10,30 30,60 60,80 C60,50 40,20 0,0 Z" fill="#60834E"/>
    <circle cx="45" cy="45" r="4" fill="#D4AF37"/>
  </g>
  <!-- Bottom-Right -->
  <g transform="translate(1140, 570) scale(-1, -1)">
    <path d="M0,0 C30,10 60,30 80,60 C50,60 20,40 0,0 Z" fill="#7DA268"/>
    <path d="M0,0 C10,30 30,60 60,80 C60,50 40,20 0,0 Z" fill="#60834E"/>
    <circle cx="45" cy="45" r="4" fill="#D4AF37"/>
  </g>

  <!-- Left Side: Couple Silhouette in Circle -->
  <g transform="translate(260, 315)">
    <circle cx="0" cy="0" r="170" fill="#FFFFFF" stroke="url(#goldOg)" stroke-width="2"/>
    <circle cx="0" cy="0" r="158" stroke="#7DA268" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>

    <!-- Couple Icon -->
    <g transform="translate(0, 10) scale(0.65)">
      <!-- Groom -->
      <path d="M-70,110 C-70,60 -35,30 -10,20 L-10,-5 C-10,-5 0,-5 0,-25 C0,-45 -10,-55 -10,-55 C-5,-80 -20,-100 -45,-100 C-70,-100 -85,-80 -80,-55 C-80,-55 -90,-45 -90,-25 C-90,-5 -80,-5 -80,-5 L-80,20 C-110,30 -140,60 -140,110 Z" fill="#213A30"/>
      <!-- Groom hair -->
      <path d="M-85,-60 C-90,-90 -70,-105 -45,-105 C-20,-105 -5,-90 -10,-60 Z" fill="#152620"/>
      <polygon points="-55,20 -25,20 -40,70" fill="#FFF"/>
      <!-- Bride -->
      <path d="M-10,-75 C-40,-35 -60,50 -70,120 C-30,130 30,135 80,120 C90,50 70,-35 40,-75 Z" fill="#EAE5DC" opacity="0.6"/>
      <path d="M-40,120 C-40,80 -15,45 15,30 L15,0 C15,0 5,-5 5,-25 C5,-45 15,-50 15,-50 C10,-70 25,-95 50,-95 C75,-95 90,-70 85,-50 C85,-50 95,-45 95,-25 C95,-5 85,0 85,0 L85,30 C115,45 140,80 140,120 Z" fill="#B87355"/>
      <circle cx="55" cy="-75" r="22" fill="#8C4F35"/>
      <path d="M15,45 C30,60 45,55 45,55 C45,55 60,60 75,45 C95,75 115,100 125,120 L-25,120 Z" fill="#FFFFFF" opacity="0.95"/>
      <!-- Bouquet -->
      <circle cx="10" cy="50" r="14" fill="#D49A7E"/>
      <circle cx="0" cy="45" r="10" fill="#7DA268"/>
      <circle cx="20" cy="45" r="10" fill="#F3E5AB"/>
    </g>
  </g>

  <!-- Right Side: Invitation Typography -->
  <g transform="translate(500, 160)">
    <!-- Eyebrow -->
    <text x="180" y="40" font-family="'Poppins', sans-serif" font-size="16" font-weight="600" fill="#7DA268" letter-spacing="6" text-anchor="middle">WEDDING INVITATION</text>
    
    <!-- Gold Divider Line -->
    <path d="M60,65 L300,65" stroke="url(#goldOg)" stroke-width="2"/>
    <polygon points="180,60 185,65 180,70 175,65" fill="#D4AF37"/>

    <!-- Main Title -->
    <text x="180" y="145" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="700" fill="#2D4A3E" text-anchor="middle">The Wedding</text>
    <text x="180" y="205" font-family="'Playfair Display', Georgia, serif" font-size="36" font-style="italic" fill="#B87355" text-anchor="middle">Celebration</text>

    <!-- Subtitle / Tagline -->
    <text x="180" y="275" font-family="'Poppins', sans-serif" font-size="16" font-weight="400" fill="#4B5563" text-anchor="middle" letter-spacing="1.5">Bersama Memulai Kisah Bahagia</text>

    <!-- Badge / Footer -->
    <rect x="70" y="310" width="220" height="38" rx="19" fill="#2D4A3E"/>
    <text x="180" y="335" font-family="'Poppins', sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">BUKA UNDANGAN</text>
  </g>
</svg>
`;

async function generateUniversalAssets() {
  console.log('🎨 Membuat aset default tema Universal (Non-Hijab)...');

  await ensureDir(path.join(UNIVERSAL_DIR, 'profile'));
  await ensureDir(path.join(UNIVERSAL_DIR, 'welcome'));
  await ensureDir(path.join(UNIVERSAL_DIR, 'seo'));

  // 1. Female (Wanita) Profile WebP
  await sharp(Buffer.from(femaleSvg))
    .resize(700, 700)
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(UNIVERSAL_DIR, 'profile', 'wanita.webp'));
  console.log('✅ wanita.webp (Universal - Non Hijab) berhasil dibuat!');

  // 2. Male (Pria) Profile WebP
  await sharp(Buffer.from(maleSvg))
    .resize(700, 700)
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(UNIVERSAL_DIR, 'profile', 'pria.webp'));
  console.log('✅ pria.webp (Universal - Modern Suit) berhasil dibuat!');

  // 3. Welcome Main WebP
  await sharp(Buffer.from(mainSvg))
    .resize(800, 800)
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(UNIVERSAL_DIR, 'welcome', 'main.webp'));
  console.log('✅ main.webp (Universal Couple) berhasil dibuat!');

  // 4. OG Image JPG & WebP
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(UNIVERSAL_DIR, 'seo', 'og-image.jpg'));

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(UNIVERSAL_DIR, 'seo', 'og-image.webp'));
  console.log('✅ og-image.jpg & og-image.webp (Universal) berhasil dibuat!');

  console.log('🎉 Seluruh aset Universal selesai di-generate!');
}

generateUniversalAssets().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
