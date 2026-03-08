@echo off
TITLE BWS Mission Control - System Startup
SETLOCAL EnableDelayedExpansion

:: -------------------------------------------------------------------
:: BLACK WALLSTREET MISSION CONTROL STARTUP SCRIPT
:: -------------------------------------------------------------------

COLOR 0E
CLS

echo.
echo  ==============================================================
echo      ____  _      ___  ________  __  _       __  ___   __
echo     / __ )/ /    /   / / ____/ / / / / /      / / / / ^| / /
echo    / / / / /    / /^| / / /   / /_/ / / / / / / / / /^| ^|^/ / 
echo   / /_/ / /___ / ___ / /___/ __  / / /_/ / /_/ / / ^|  /  
echo  /_____/_____/_/  ^|_/____/_/ /_/  \____/\____/_/  ^|_/   
echo.
echo  ==============================================================
echo                MISSION: BLACK WALLSTREET PORTAL
echo  ==============================================================
echo.

:: Check if node_modules exists
IF NOT EXIST "node_modules\" (
    echo [!] WARNING: node_modules folder not found.
    echo [i] Attempting to install dependencies...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [X] ERROR: Dependency installation failed. 
        echo [i] Please ensure Node.js is installed correctly.
        pause
        exit /b %ERRORLEVEL%
    )
    echo.
    echo [OK] Dependencies installed successfully.
    echo.
)

echo [i] Launching BWS Development Server...
echo [i] Engine: React-App-Rewired
echo.

:: Start the site
call npm start

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [X] ERROR: The server crashed or failed to start.
    echo [i] Check the logs above for details.
    pause
)

echo.
echo [i] Mission Terminated.
pause
