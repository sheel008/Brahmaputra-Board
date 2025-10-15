@echo off
echo Starting Brahmaputra Board Backend Server...
echo.

cd /d "%~dp0backend"
echo Current directory: %CD%
echo.

echo Installing dependencies if needed...
npm install express cors

echo.
echo Starting server...
node simple-server.js

echo.
echo Server stopped. Press any key to exit...
pause
