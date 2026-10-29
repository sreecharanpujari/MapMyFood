@echo off
title Map My Food Launcher
echo ========================================================
echo       Starting Map My Food (Frontend + Backend)
echo ========================================================
echo.

echo [1/3] Launching Python Backend API (Port 8000)...
start "Map My Food - Backend API" powershell -NoExit -Command "cd '%~dp0'; Write-Host 'Starting Backend API on http://127.0.0.1:8000...' -ForegroundColor Green; python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Launching React Frontend (Port 5173)...
start "Map My Food - Frontend UI" powershell -NoExit -Command "$env:PATH = '$env:LOCALAPPDATA\Programs\nodejs;' + $env:PATH; cd '%~dp0frontend'; Write-Host 'Starting Frontend on http://localhost:5173...' -ForegroundColor Cyan; npm run dev"

echo [3/3] Opening browser in 4 seconds...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo   Map My Food is running!
echo   Frontend: http://localhost:5173
echo   Backend Docs: http://127.0.0.1:8000/docs
echo ========================================================
echo You can close this window now. Leave the other two windows open.
pause

