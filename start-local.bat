@echo off
echo ========================================
echo   Mo Hinh Cao Cap - Local Development
echo ========================================
echo.

echo Setting up local environment...
cd backend

echo Starting backend server...
echo Backend will run on: http://localhost:5000
echo API endpoints: http://localhost:5000/api
echo.
echo Frontend should be served from: http://localhost:5500 or similar
echo.
echo Press Ctrl+C to stop the server
echo.

npm start