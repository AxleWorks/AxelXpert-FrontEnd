# AxelXpert Frontend Startup Script
Write-Host "================================" -ForegroundColor Green
Write-Host "   AxelXpert Frontend Startup" -ForegroundColor Green  
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "Navigating to project directory..." -ForegroundColor Yellow
Set-Location "E:\Software Projects Sineth\Sineth's Projects\AxelXpert\AxelXpert-FrontEnd"

Write-Host ""
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
node --version
Write-Host ""

Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "   Server will start below" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Once started, open: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

npm run dev
