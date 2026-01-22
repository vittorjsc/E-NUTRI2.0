# Script para enviar código para GitHub - E-Nutri 2.0
# Execute este script no diretório do projeto

Write-Host "=== Enviando E-Nutri 2.0 para GitHub ===" -ForegroundColor Green
Write-Host "Repositório: https://github.com/vittorjsc/E-NUTRI2.0.git" -ForegroundColor Cyan

# Obter o diretório atual do script
$scriptDir = $PSScriptRoot
if ([string]::IsNullOrEmpty($scriptDir)) {
    $scriptDir = Get-Location
}

Set-Location $scriptDir
Write-Host "`nDiretório: $scriptDir" -ForegroundColor Yellow

# Verificar se já é repositório Git
if (Test-Path ".git") {
    Write-Host "`n✅ Repositório Git já inicializado" -ForegroundColor Green
} else {
    Write-Host "`nInicializando repositório Git..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao inicializar Git!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Repositório inicializado!" -ForegroundColor Green
}

# Verificar/Adicionar remote
$remoteCheck = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Remote já configurado: $remoteCheck" -ForegroundColor Green
} else {
    Write-Host "`nAdicionando remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/vittorjsc/E-NUTRI2.0.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao adicionar remote!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Remote adicionado!" -ForegroundColor Green
}

# Adicionar arquivos
Write-Host "`nAdicionando arquivos..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao adicionar arquivos!" -ForegroundColor Red
    exit 1
}

# Verificar se há mudanças
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "`n⚠️ Nenhuma mudança para commitar" -ForegroundColor Yellow
    Write-Host "Verificando se já existe commit..." -ForegroundColor Yellow
    $hasCommits = git log --oneline -1 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Nenhum commit encontrado e nada para commitar!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Arquivos adicionados!" -ForegroundColor Green
    
    # Fazer commit
    Write-Host "`nFazendo commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: E-Nutri 2.0 - Sistema completo de gerenciamento de pacientes para nutricionistas"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao fazer commit!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
}

# Configurar branch main
Write-Host "`nConfigurando branch 'main'..." -ForegroundColor Yellow
$currentBranch = git branch --show-current 2>&1
if ($currentBranch -ne "main") {
    git branch -M main 2>&1 | Out-Null
}
Write-Host "✅ Branch configurada!" -ForegroundColor Green

# Fazer push
Write-Host "`nEnviando para GitHub..." -ForegroundColor Yellow
Write-Host "(Se pedir autenticação, use suas credenciais do GitHub)" -ForegroundColor Gray
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 SUCESSO! Código enviado para GitHub!" -ForegroundColor Green
    Write-Host "`n📦 Repositório: https://github.com/vittorjsc/E-NUTRI2.0" -ForegroundColor Cyan
    Write-Host "`n✅ Todos os arquivos foram enviados com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Erro ao fazer push. Possíveis causas:" -ForegroundColor Yellow
    Write-Host "1. Problema de autenticação" -ForegroundColor White
    Write-Host "2. Repositório remoto tem conteúdo diferente" -ForegroundColor White
    Write-Host "`nTente executar manualmente:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
    Write-Host "`nOu se o repositório remoto tiver conteúdo:" -ForegroundColor Yellow
    Write-Host "  git pull origin main --allow-unrelated-histories" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
}

Write-Host "`n=== Concluído ===" -ForegroundColor Green

