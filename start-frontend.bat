@echo off
echo ================================
echo   AxelXpert Frontend Startup
echo ================================
echo.

echo Navigating to project directory...
cd /d "E:\Software Projects Sineth\Sineth's Projects\AxelXpert\AxelXpert-FrontEnd"

echo.
echo Checking Node.js version...
node --version
echo.

echo Starting development server...
echo.
echo ================================
echo   Server will start below
echo ================================
echo.
echo Once started, open: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
