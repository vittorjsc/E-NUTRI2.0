# Script de instalação do Frontend - E-Nutri
Write-Host "=== Instalação do Frontend E-Nutri ===" -ForegroundColor Green

# Verificar Node.js
Write-Host "`nVerificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Node.js LTS de https://nodejs.org/" -ForegroundColor Red
    Write-Host "Após instalar, reinicie o terminal e execute este script novamente." -ForegroundColor Yellow
    exit 1
}
Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green

# Verificar npm
Write-Host "`nVerificando npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: npm não encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green

# Limpar cache (opcional)
Write-Host "`nLimpando cache do npm..." -ForegroundColor Yellow
npm cache clean --force

# Instalar dependências
Write-Host "`nInstalando dependências (isso pode levar alguns minutos)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao instalar dependências!" -ForegroundColor Red
    Write-Host "Tentando com --legacy-peer-deps..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO persistente. Verifique sua conexão com a internet." -ForegroundColor Red
        exit 1
    }
}
Write-Host "Dependências instaladas com sucesso!" -ForegroundColor Green

# Configurar .env.local
Write-Host "`nConfigurando variáveis de ambiente..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    @"
NEXT_PUBLIC_API_URL=http://localhost:8000
"@ | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "Arquivo .env.local criado!" -ForegroundColor Green
} else {
    Write-Host "Arquivo .env.local já existe." -ForegroundColor Yellow
}

Write-Host "`n=== Instalação concluída! ===" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Certifique-se de que o backend está rodando em http://localhost:8000" -ForegroundColor Cyan
Write-Host "2. Execute: npm run dev (para iniciar o servidor de desenvolvimento)" -ForegroundColor Cyan
Write-Host "3. Acesse: http://localhost:3000" -ForegroundColor Cyan



