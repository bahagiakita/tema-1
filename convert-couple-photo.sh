#!/usr/bin/env bash
# ============================================================
# 💍 BahagiaKita — Script Konversi 1 Foto Couple Sekali Klik
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js tidak ditemukan di sistem Anda."
    echo "Silakan install Node.js terlebih dahulu."
    echo ""
    read -p "Tekan [Enter] untuk keluar..."
    exit 1
fi

node scripts/split-couple-photo.js "$@"

echo ""
read -p "Tekan [Enter] untuk menutup jendela ini..."
