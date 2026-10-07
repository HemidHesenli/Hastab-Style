@echo off
cd /d "%~dp0"
start "" http://localhost:5190
node serve.js
