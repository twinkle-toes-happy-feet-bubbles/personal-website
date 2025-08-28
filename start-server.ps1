Write-Host "Starting local web server..." -ForegroundColor Green
Write-Host ""
Write-Host "Your blog will be available at:" -ForegroundColor Yellow
Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Try different server options
try {
    # Try Python 3 first
    python -m http.server 8000
} catch {
    try {
        # Try Python 2 if Python 3 fails
        python -m SimpleHTTPServer 8000
    } catch {
        try {
            # Try Node.js if Python fails
            npx http-server -p 8000
        } catch {
            Write-Host "Error: No suitable web server found." -ForegroundColor Red
            Write-Host ""
            Write-Host "Please install one of the following:" -ForegroundColor Yellow
            Write-Host "1. Python: https://python.org" -ForegroundColor White
            Write-Host "2. Node.js: https://nodejs.org" -ForegroundColor White
            Write-Host "3. Use VS Code Live Server extension" -ForegroundColor White
            Read-Host "Press Enter to continue"
        }
    }
}