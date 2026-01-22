# Script de instalação do Backend - E-Nutri
Write-Host "=== Instalação do Backend E-Nutri ===" -ForegroundColor Green

# Verificar Python
Write-Host "`nVerificando Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Python não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale Python 3.11+ de https://www.python.org/" -ForegroundColor Red
    exit 1
}
Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green

# Criar ambiente virtual
Write-Host "`nCriando ambiente virtual..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "Ambiente virtual já existe. Pulando criação." -ForegroundColor Yellow
} else {
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO ao criar ambiente virtual!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Ambiente virtual criado com sucesso!" -ForegroundColor Green
}

# Ativar ambiente virtual
Write-Host "`nAtivando ambiente virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao ativar ambiente virtual!" -ForegroundColor Red
    Write-Host "Tente executar: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    exit 1
}

# Atualizar pip
Write-Host "`nAtualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Instalar dependências
Write-Host "`nInstalando dependências..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao instalar dependências!" -ForegroundColor Red
    exit 1
}
Write-Host "Dependências instaladas com sucesso!" -ForegroundColor Green

# Configurar .env
Write-Host "`nConfigurando variáveis de ambiente..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item env.example.txt .env
    Write-Host "Arquivo .env criado. IMPORTANTE: Edite e configure as chaves de segurança!" -ForegroundColor Yellow
    
    # Gerar ENCRYPTION_KEY
    Write-Host "`nGerando ENCRYPTION_KEY..." -ForegroundColor Yellow
    $encryptionKey = python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
    Write-Host "ENCRYPTION_KEY gerada: $encryptionKey" -ForegroundColor Cyan
    Write-Host "Adicione esta chave no arquivo .env" -ForegroundColor Yellow
} else {
    Write-Host "Arquivo .env já existe." -ForegroundColor Yellow
}

# Executar migrations
Write-Host "`nExecutando migrations..." -ForegroundColor Yellow
alembic upgrade head
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: Erro ao executar migrations. Tente manualmente: alembic upgrade head" -ForegroundColor Yellow
}

Write-Host "`n=== Instalação concluída! ===" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Edite o arquivo .env e configure as chaves de segurança" -ForegroundColor Cyan
Write-Host "2. Execute: python scripts/seed.py (para criar dados de exemplo)" -ForegroundColor Cyan
Write-Host "3. Execute: uvicorn app.main:app --reload (para iniciar o servidor)" -ForegroundColor Cyan



