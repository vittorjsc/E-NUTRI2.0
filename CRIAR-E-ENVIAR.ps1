# Script para criar repositório no GitHub e enviar o projeto
Write-Host "=== Criar Repositório e Enviar E-Nutri 2.0 ===" -ForegroundColor Green

# Verificar se GitHub CLI está instalado
$ghInstalled = $false
try {
    $ghVersion = gh --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ghInstalled = $true
        Write-Host "`n✅ GitHub CLI encontrado!" -ForegroundColor Green
    }
} catch {
    $ghInstalled = $false
}

if ($ghInstalled) {
    Write-Host "`n=== Usando GitHub CLI ===" -ForegroundColor Cyan
    
    # Verificar se está autenticado
    $authCheck = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n⚠️ Você precisa fazer login no GitHub CLI primeiro" -ForegroundColor Yellow
        Write-Host "Execute: gh auth login" -ForegroundColor Cyan
        $doLogin = Read-Host "Deseja fazer login agora? (S/N)"
        if ($doLogin -eq "S" -or $doLogin -eq "s") {
            gh auth login
        } else {
            Write-Host "Execute 'gh auth login' e depois rode este script novamente" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Perguntar nome do repositório
    Write-Host "`nNome do repositório (deixe vazio para 'E-NUTRI2.0'):" -ForegroundColor Yellow
    $repoName = Read-Host
    if ([string]::IsNullOrWhiteSpace($repoName)) {
        $repoName = "E-NUTRI2.0"
    }
    
    # Perguntar visibilidade
    Write-Host "`nVisibilidade do repositório:" -ForegroundColor Yellow
    Write-Host "1. Public (público)" -ForegroundColor White
    Write-Host "2. Private (privado)" -ForegroundColor White
    $visibility = Read-Host "Escolha (1 ou 2)"
    $isPublic = $visibility -eq "1"
    
    # Inicializar Git se necessário
    if (-not (Test-Path ".git")) {
        Write-Host "`nInicializando Git..." -ForegroundColor Yellow
        git init
    }
    
    # Criar repositório e fazer push
    Write-Host "`nCriando repositório no GitHub..." -ForegroundColor Yellow
    if ($isPublic) {
        gh repo create $repoName --public --source=. --remote=origin --push
    } else {
        gh repo create $repoName --private --source=. --remote=origin --push
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 SUCESSO! Repositório criado e código enviado!" -ForegroundColor Green
        Write-Host "`n📦 Repositório: https://github.com/vittorjsc/$repoName" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Erro ao criar repositório" -ForegroundColor Red
        Write-Host "Tente criar manualmente no GitHub e use os comandos abaixo" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n=== GitHub CLI não encontrado ===" -ForegroundColor Yellow
    Write-Host "`nVocê precisa criar o repositório manualmente no GitHub:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://github.com/new" -ForegroundColor Cyan
    Write-Host "2. Crie um novo repositório" -ForegroundColor Cyan
    Write-Host "3. NÃO marque nenhuma opção (sem README, sem .gitignore)" -ForegroundColor Cyan
    Write-Host "4. Copie a URL do repositório" -ForegroundColor Cyan
    
    $repoUrl = Read-Host "`nCole a URL do repositório aqui (ex: https://github.com/vittorjsc/E-NUTRI2.0.git)"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ URL não fornecida!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`nConfigurando Git e enviando código..." -ForegroundColor Yellow
    
    # Inicializar Git
    if (-not (Test-Path ".git")) {
        git init
    }
    
    # Remover remote antigo se existir
    $oldRemote = git remote get-url origin 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Removendo remote antigo..." -ForegroundColor Yellow
        git remote remove origin
    }
    
    # Adicionar novo remote
    git remote add origin $repoUrl
    
    # Adicionar arquivos
    Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
    git add .
    
    # Verificar se há mudanças
    $status = git status --porcelain
    if (-not [string]::IsNullOrWhiteSpace($status)) {
        # Fazer commit
        Write-Host "Fazendo commit..." -ForegroundColor Yellow
        git commit -m "Initial commit: E-Nutri 2.0 - Sistema completo de gerenciamento de pacientes"
    }
    
    # Configurar branch
    git branch -M main
    
    # Fazer push
    Write-Host "Enviando para GitHub..." -ForegroundColor Yellow
    Write-Host "(Se pedir autenticação, use suas credenciais do GitHub)" -ForegroundColor Gray
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 SUCESSO! Código enviado para GitHub!" -ForegroundColor Green
        Write-Host "`n📦 Repositório: $repoUrl" -ForegroundColor Cyan
    } else {
        Write-Host "`n⚠️ Erro ao fazer push. Verifique:" -ForegroundColor Yellow
        Write-Host "1. Se o repositório existe no GitHub" -ForegroundColor White
        Write-Host "2. Se você tem permissão de escrita" -ForegroundColor White
        Write-Host "3. Se suas credenciais estão corretas" -ForegroundColor White
        Write-Host "`nTente executar manualmente:" -ForegroundColor Yellow
        Write-Host "  git push -u origin main" -ForegroundColor Cyan
    }
}

Write-Host "`n=== Concluído ===" -ForegroundColor Green

