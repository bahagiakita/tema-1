#!/usr/bin/env bash

# ============================================================
# BahagiaKita — Restore Master Template from Safety Vault
# ============================================================

set -e
cd "$(dirname "$0")"

echo "🔄 Merestore aset master template dari .template-vault..."
node scripts/restore-template.js

read -p "Tekan Enter untuk menutup..." dummy
