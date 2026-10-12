@echo off
title Employee Tracking System - Runner
echo ========================================================
echo   Starting Employee Tracking System (Backend + Frontend)
echo ========================================================

cd /d "%~dp0"

echo [1/2] Starting Backend on http://localhost:5000...
start "Employee Tracking - Backend" cmd /k "cd backend && node server.js"

echo [2/2] Starting Frontend on http://localhost:3000...
start "Employee Tracking - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo - Backend:  http://localhost:5000/api/health
echo - Frontend: http://localhost:3000
echo.
echo NOTE: Do not close those two command prompt windows while using the app.
echo You can close this window now.
pause
