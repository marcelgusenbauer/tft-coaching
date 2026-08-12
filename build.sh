#!/bin/sh
# Assembles dist/ for Cloudflare Pages. Referenced as the project's build command.
set -e
mkdir -p dist/assets
cp index.html styles.css main.js config.js robots.txt sitemap.xml dist/
cp assets/logo.png assets/og-image.png dist/assets/
