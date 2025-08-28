@echo off
echo Starting local web server...
echo.
echo Your blog will be available at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first
python -m http.server 8000 2>nul
if %errorlevel% neq 0 (
    REM Try Python 2 if Python 3 fails
    python -m SimpleHTTPServer 8000 2>nul
    if %errorlevel% neq 0 (
        REM Try Node.js if Python fails
        npx http-server -p 8000 2>nul
        if %errorlevel% neq 0 (
            echo Error: No suitable web server found.
            echo Please install Python or Node.js to run a local server.
            echo.
            echo Alternatives:
            echo 1. Install Python: https://python.org
            echo 2. Install Node.js: https://nodejs.org
            echo 3. Use VS Code Live Server extension
            pause
        )
    )
)