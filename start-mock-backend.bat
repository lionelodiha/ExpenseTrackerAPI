@echo off
echo.
echo ========================================
echo   Starting Air Pay Mock Backend
echo ========================================
echo.

cd backend-mock

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting server on http://localhost:5068
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
