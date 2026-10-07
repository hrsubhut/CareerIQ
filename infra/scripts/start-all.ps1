# CareerIQ Development Startup Script (PowerShell)
Write-Host "Starting CareerIQ Microservices..." -ForegroundColor Cyan

$services = @(
    @{ Name = "Resume Service"; Dir = "services/resume-service"; Port = 8001 },
    @{ Name = "Salary Service"; Dir = "services/salary-service"; Port = 8002 },
    @{ Name = "Location Service"; Dir = "services/location-service"; Port = 8003 },
    @{ Name = "Market Service"; Dir = "services/market-service"; Port = 8004 },
    @{ Name = "Profile Service"; Dir = "services/profile-service"; Port = 8005 },
    @{ Name = "API Gateway"; Dir = "services/api-gateway"; Port = 8000 }
)

foreach ($svc in $services) {
    Write-Host "Starting $($svc.Name) on port $($svc.Port)..." -ForegroundColor Green
    Start-Process -FilePath "uvicorn" -ArgumentList "app.main:app --port $($svc.Port) --reload" -WorkingDirectory $svc.Dir
}

Write-Host "Starting Frontend on port 5173..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "frontend"

Write-Host "`nAll CareerIQ services launched!" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8000" -ForegroundColor White
Write-Host "API Docs:    http://localhost:8000/docs" -ForegroundColor White
Write-Host "Frontend:    http://localhost:5173" -ForegroundColor White
