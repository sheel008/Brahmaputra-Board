@echo off
echo Starting Brahmaputra Board Backend Server...
cd /d "C:\Users\Swarali\OneDrive\Desktop\Prototype\Ganpati Bappa\bramhaputraboard\server"
echo.
echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)
echo.
echo Seeding database...
npm run seed
echo.
echo Starting server on http://localhost:5000...
echo Press Ctrl+C to stop the server
echo.
npm start
pause
