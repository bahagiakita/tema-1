#!/usr/bin/env bash

# ============================================================
# BahagiaKita — Finalize & Minify Invitation for Production
# ============================================================

set -e
cd "$(dirname "$0")"

echo "🚀 Menjalankan proses finalisasi dan minifikasi undangan..."
node scripts/finalize-invitation.js

read -p "Tekan Enter untuk menutup..." dummy
