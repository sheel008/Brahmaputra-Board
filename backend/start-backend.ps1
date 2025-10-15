# Start Brahmaputra Board Backend Server
Write-Host "Starting Brahmaputra Board Backend Server..." -ForegroundColor Green

# Change to server directory
Set-Location "C:\Users\Swarali\OneDrive\Desktop\Prototype\Ganpati Bappa\bramhaputraboard\server"

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoTest = Test-NetConnection -ComputerName "127.0.0.1" -Port 27017 -InformationLevel Quiet
    if ($mongoTest) {
        Write-Host "MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
        Write-Host "You can start MongoDB with: mongod" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Could not check MongoDB status. Make sure MongoDB is installed and running." -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Seed database
Write-Host "Seeding database..." -ForegroundColor Yellow
npm run seed

# Start the server
Write-Host "Starting server on http://localhost:5000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
npm start
