@echo off
echo Starting Brahmaputra Board Development Environment...

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node mock-server.js"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Press any key to exit...
pause > nul
