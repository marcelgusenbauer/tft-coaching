#!/bin/sh
# Cloudflare Pages build command: sh build.sh
# Renders dist/ from config.json — a broken config fails here, which keeps the
# last good deployment online instead of publishing a damaged page.
set -e

if ! command -v node >/dev/null 2>&1; then
  echo "FEHLER: node ist im Build-Image nicht verfügbar."
  echo "In den Cloudflare-Pages-Einstellungen NODE_VERSION=20 setzen."
  exit 1
fi

echo "Node: $(node --version)"
node build.js
