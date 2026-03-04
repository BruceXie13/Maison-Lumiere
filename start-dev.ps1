# Start both backend and frontend dev servers
Write-Host "Starting Maison Lumière dev servers..." -ForegroundColor Cyan

# Start backend
Write-Host "Starting backend (FastAPI) on http://localhost:8000 ..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "py" -ArgumentList "run.py" -WorkingDirectory "$PSScriptRoot\backend" -PassThru -NoNewWindow

Start-Sleep -Seconds 2

# Start frontend
Write-Host "Starting frontend (Vite) on http://localhost:5173 ..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "npx" -ArgumentList "vite", "--host" -WorkingDirectory "$PSScriptRoot" -PassThru -NoNewWindow

Write-Host ""
Write-Host "Both servers started!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers..." -ForegroundColor Gray

try {
    Wait-Process -Id $backend.Id
} finally {
    Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
}
