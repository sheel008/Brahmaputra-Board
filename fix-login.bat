@echo off
echo ========================================
echo   Brahmaputra Board - Login Fix
echo ========================================
echo.

echo Step 1: Installing dependencies...
cd backend
npm install express cors

echo.
echo Step 2: Starting backend server...
echo Server will run in a new window.
echo.

start "Backend Server" cmd /k "node basic-server.js"

echo.
echo Step 3: Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo Step 4: Testing server connection...
curl http://localhost:5000/api/health

echo.
echo ========================================
echo   Backend server should now be running!
echo ========================================
echo.
echo Frontend URL: http://localhost:8080
echo Backend URL: http://localhost:5000
echo.
echo Demo credentials:
echo   Employee: rajesh.kumar@brahmaputra.gov.in / password123
echo   Division Head: priya.sharma@brahmaputra.gov.in / password123
echo   Administrator: admin@brahmaputra.gov.in / admin123
echo.
echo Press any key to exit...
pause > nul
