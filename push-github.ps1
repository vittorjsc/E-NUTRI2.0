# Script para fazer push do código para o GitHub
Write-Host "=== Enviando código para GitHub ===" -ForegroundColor Green

# Navegar para o diretório do projeto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "`nDiretório atual: $(Get-Location)" -ForegroundColor Cyan

# Verificar se já é um repositório Git
if (Test-Path ".git") {
    Write-Host "`nRepositório Git já inicializado." -ForegroundColor Yellow
} else {
    Write-Host "`nInicializando repositório Git..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO ao inicializar repositório Git!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Repositório inicializado!" -ForegroundColor Green
}

# Verificar se o remote já existe
$remoteExists = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "`nRemote 'origin' já configurado: $remoteExists" -ForegroundColor Yellow
    $update = Read-Host "Deseja atualizar para https://github.com/vittorjsc/E-NUTRI2.0.git? (S/N)"
    if ($update -eq "S" -or $update -eq "s") {
        git remote set-url origin https://github.com/vittorjsc/E-NUTRI2.0.git
        Write-Host "✅ Remote atualizado!" -ForegroundColor Green
    }
} else {
    Write-Host "`nAdicionando remote 'origin'..." -ForegroundColor Yellow
    git remote add origin https://github.com/vittorjsc/E-NUTRI2.0.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO ao adicionar remote!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Remote adicionado!" -ForegroundColor Green
}

# Adicionar todos os arquivos
Write-Host "`nAdicionando arquivos ao staging..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao adicionar arquivos!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Arquivos adicionados!" -ForegroundColor Green

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "`nNenhuma mudança para commitar." -ForegroundColor Yellow
} else {
    Write-Host "`nFazendo commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: E-Nutri 2.0 - Sistema completo de gerenciamento de pacientes para nutricionistas"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO ao fazer commit!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Commit realizado!" -ForegroundColor Green
}

# Renomear branch para main (se necessário)
Write-Host "`nConfigurando branch 'main'..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    git branch -M main
    Write-Host "✅ Branch renomeada para 'main'!" -ForegroundColor Green
} else {
    Write-Host "✅ Já está na branch 'main'!" -ForegroundColor Green
}

# Fazer push
Write-Host "`nEnviando para GitHub..." -ForegroundColor Yellow
Write-Host "(Você pode precisar fazer login no GitHub)" -ForegroundColor Gray
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Código enviado com sucesso para GitHub!" -ForegroundColor Green
    Write-Host "`nRepositório: https://github.com/vittorjsc/E-NUTRI2.0" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Erro ao fazer push. Possíveis causas:" -ForegroundColor Yellow
    Write-Host "1. Você precisa fazer login no GitHub" -ForegroundColor White
    Write-Host "2. Você precisa configurar autenticação (token ou SSH)" -ForegroundColor White
    Write-Host "3. O repositório pode ter conteúdo que precisa ser puxado primeiro" -ForegroundColor White
    Write-Host "`nTente executar manualmente:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
}

Write-Host "`n=== Concluído ===" -ForegroundColor Green


