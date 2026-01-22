# Script para configurar Git e fazer push para GitHub
Set-Location $PSScriptRoot

# Inicializa o repositório Git
Write-Host "Inicializando repositório Git..." -ForegroundColor Green
git init

# Adiciona todos os arquivos
Write-Host "Adicionando arquivos..." -ForegroundColor Green
git add .

# Faz o commit inicial
Write-Host "Fazendo commit inicial..." -ForegroundColor Green
git commit -m "Initial commit: E-Nutri 2.0 - Sistema completo de gerenciamento de pacientes"

# Adiciona o remote
Write-Host "Configurando remote..." -ForegroundColor Green
git remote add origin https://github.com/vittorjsc/E-NUTRI2.0.git

# Verifica se o remote foi adicionado
Write-Host "Verificando remote..." -ForegroundColor Green
git remote -v

Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute: git branch -M main" -ForegroundColor Cyan
Write-Host "2. Execute: git push -u origin main" -ForegroundColor Cyan
Write-Host "`nOu execute este script completo:" -ForegroundColor Yellow
Write-Host "git branch -M main" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan

