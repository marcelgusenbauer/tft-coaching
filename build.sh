#!/bin/sh
# Cloudflare Pages build command: sh build.sh
# Renders dist/ from config.json — a broken config fails here, which keeps the
# last good deployment online instead of publishing a damaged page.
set -e
node build.js
