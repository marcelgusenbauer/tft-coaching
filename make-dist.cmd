@echo off
rem Rebuilds the dist/ folder for Cloudflare Pages upload.
cd /d "%~dp0"
if exist dist rmdir /s /q dist
mkdir dist\assets
copy /y index.html dist\ >nul
copy /y styles.css dist\ >nul
copy /y main.js dist\ >nul
copy /y config.js dist\ >nul
copy /y assets\logo.png dist\assets\ >nul
echo dist/ ist bereit fuer den Upload.
pause
