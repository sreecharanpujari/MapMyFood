@echo off
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
title Push Map My Food to GitHub
echo ========================================================
echo         Push Map My Food to your GitHub Account
echo ========================================================
echo.
echo Make sure you have created an empty repository on https://github.com/new
echo (Do not check 'Add a README file' or '.gitignore' on GitHub)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/map-my-food.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Exiting.
    pause
    exit /b
)

echo.
echo [1/3] Setting remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Setting branch to main...
git branch -M main

echo [3/3] Pushing code to GitHub...
git push -u origin main

echo.
echo ========================================================
echo If prompted, sign in with your GitHub account in the pop-up.
echo Once completed, your project will be live on GitHub!
echo ========================================================
pause
