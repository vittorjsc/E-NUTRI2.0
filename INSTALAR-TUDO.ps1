# Script completo de instalação - E-Nutri 2.0
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALAÇÃO COMPLETA - E-NUTRI 2.0" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Verificar pré-requisitos
Write-Host "`n=== Verificando Pré-requisitos ===" -ForegroundColor Green

# Python
Write-Host "`nVerificando Python..." -ForegroundColor Yellow
$pythonCheck = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Python: $pythonCheck" -ForegroundColor Green
} else {
    Write-Host "❌ Python não encontrado!" -ForegroundColor Red
    Write-Host "   Instale Python 3.11+ de https://www.python.org/" -ForegroundColor Yellow
    exit 1
}

# Node.js
Write-Host "`nVerificando Node.js..." -ForegroundColor Yellow
$nodeCheck = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js: $nodeCheck" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   Instale Node.js LTS de https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   Após instalar, reinicie o terminal e execute este script novamente." -ForegroundColor Yellow
    exit 1
}

# npm
Write-Host "`nVerificando npm..." -ForegroundColor Yellow
$npmCheck = npm --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ npm: $npmCheck" -ForegroundColor Green
} else {
    Write-Host "❌ npm não encontrado!" -ForegroundColor Red
    exit 1
}

# Instalar Backend
Write-Host "`n=== Instalando Backend ===" -ForegroundColor Green
Set-Location backend
& .\install.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO na instalação do backend!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# Instalar Frontend
Write-Host "`n=== Instalando Frontend ===" -ForegroundColor Green
Set-Location frontend
& .\install.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO na instalação do frontend!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  INSTALAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPara iniciar o sistema:" -ForegroundColor Yellow
Write-Host "`nTerminal 1 - Backend:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  uvicorn app.main:app --reload" -ForegroundColor White

Write-Host "`nTerminal 2 - Frontend:" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White

Write-Host "`nAcesse:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Cyan



