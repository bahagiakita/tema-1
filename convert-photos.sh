#!/usr/bin/env bash
# ============================================================
# 💍 BahagiaKita — Script Konversi Foto Sekali Klik
# ============================================================

# Pastikan script berjalan dari direktori root proyek
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Periksa apakah Node.js terpasang
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js tidak ditemukan di sistem Anda."
    echo "Silakan install Node.js terlebih dahulu."
    echo ""
    read -p "Tekan [Enter] untuk keluar..."
    exit 1
fi

# Jalankan script Node.js
node scripts/process-photos.js

# Jaga terminal tetap terbuka jika dijalankan via klik di File Manager
echo ""
read -p "Tekan [Enter] untuk menutup jendela ini..."
