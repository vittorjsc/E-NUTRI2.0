# Script para verificar e corrigir instalação do Node.js/npm
Write-Host "=== Verificação do Node.js e npm ===" -ForegroundColor Green

# Verificar se está no PATH
Write-Host "`n1. Verificando Node.js no PATH..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js não encontrado no PATH" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Node.js não encontrado no PATH" -ForegroundColor Red
}

Write-Host "`n2. Verificando npm no PATH..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm não encontrado no PATH" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ npm não encontrado no PATH" -ForegroundColor Red
}

# Procurar Node.js em locais comuns
Write-Host "`n3. Procurando Node.js em locais comuns..." -ForegroundColor Yellow
$commonPaths = @(
    "$env:ProgramFiles\nodejs",
    "$env:ProgramFiles(x86)\nodejs",
    "$env:LOCALAPPDATA\Programs\nodejs",
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs"
)

$nodeFound = $false
$npmFound = $false
$nodePath = $null
$npmPath = $null

foreach ($path in $commonPaths) {
    if (Test-Path $path) {
        Write-Host "   Verificando: $path" -ForegroundColor Cyan
        
        $nodeExe = Join-Path $path "node.exe"
        $npmCmd = Join-Path $path "npm.cmd"
        
        if (Test-Path $nodeExe) {
            $nodeFound = $true
            $nodePath = $path
            $version = & $nodeExe --version
            Write-Host "   ✅ Node.js encontrado: $version em $path" -ForegroundColor Green
        }
        
        if (Test-Path $npmCmd) {
            $npmFound = $true
            $npmPath = $path
            Write-Host "   ✅ npm encontrado em $path" -ForegroundColor Green
        }
    }
}

# Verificar variável de ambiente
Write-Host "`n4. Verificando variáveis de ambiente..." -ForegroundColor Yellow
$envPath = $env:PATH
if ($envPath -like "*nodejs*") {
    Write-Host "✅ Node.js encontrado no PATH do sistema" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js NÃO está no PATH do sistema" -ForegroundColor Red
}

# Soluções
Write-Host "`n=== SOLUÇÕES ===" -ForegroundColor Cyan

if (-not $nodeFound) {
    Write-Host "`n❌ Node.js não foi encontrado!" -ForegroundColor Red
    Write-Host "`nSoluções:" -ForegroundColor Yellow
    Write-Host "1. Reinstale o Node.js de https://nodejs.org/" -ForegroundColor White
    Write-Host "   - Durante a instalação, CERTIFIQUE-SE de marcar 'Add to PATH'" -ForegroundColor White
    Write-Host "   - Escolha a opção 'Automatically install the necessary tools'" -ForegroundColor White
    Write-Host "`n2. Após instalar, REINICIE o terminal/PowerShell completamente" -ForegroundColor White
    Write-Host "`n3. Verifique manualmente se o Node.js está instalado:" -ForegroundColor White
    Write-Host "   - Abra o Explorador de Arquivos" -ForegroundColor White
    Write-Host "   - Vá para: C:\Program Files\nodejs" -ForegroundColor White
    Write-Host "   - Veja se existem os arquivos node.exe e npm.cmd" -ForegroundColor White
} elseif ($nodeFound -and -not $npmFound) {
    Write-Host "`n⚠️ Node.js encontrado, mas npm não!" -ForegroundColor Yellow
    Write-Host "`nIsso é raro. Tente:" -ForegroundColor Yellow
    Write-Host "1. Reinstale o Node.js (npm vem junto)" -ForegroundColor White
    Write-Host "2. Ou adicione manualmente ao PATH:" -ForegroundColor White
    Write-Host "   - Pressione Win + R, digite: sysdm.cpl" -ForegroundColor White
    Write-Host "   - Aba 'Avançado' > 'Variáveis de Ambiente'" -ForegroundColor White
    Write-Host "   - Em 'Variáveis do sistema', edite 'Path'" -ForegroundColor White
    Write-Host "   - Adicione: $nodePath" -ForegroundColor White
} elseif ($nodeFound -and $npmFound) {
    Write-Host "`n✅ Node.js e npm encontrados, mas não estão no PATH!" -ForegroundColor Yellow
    Write-Host "`nSolução: Adicione ao PATH manualmente" -ForegroundColor Yellow
    Write-Host "`nOpção 1 - Via PowerShell (temporário para esta sessão):" -ForegroundColor Cyan
    Write-Host "   `$env:PATH += `";$nodePath`"" -ForegroundColor White
    Write-Host "   Teste: node --version" -ForegroundColor White
    
    Write-Host "`nOpção 2 - Adicionar permanentemente:" -ForegroundColor Cyan
    Write-Host "   1. Pressione Win + R, digite: sysdm.cpl" -ForegroundColor White
    Write-Host "   2. Aba 'Avançado' > 'Variáveis de Ambiente'" -ForegroundColor White
    Write-Host "   3. Em 'Variáveis do sistema', edite 'Path'" -ForegroundColor White
    Write-Host "   4. Clique em 'Novo' e adicione: $nodePath" -ForegroundColor White
    Write-Host "   5. Clique em 'OK' em todas as janelas" -ForegroundColor White
    Write-Host "   6. REINICIE o terminal/PowerShell" -ForegroundColor White
    
    Write-Host "`nOu execute este comando como Administrador:" -ForegroundColor Cyan
    Write-Host "   [Environment]::SetEnvironmentVariable('Path', `$env:Path + `";$nodePath`", 'Machine')" -ForegroundColor White
    Write-Host "   (Depois reinicie o terminal)" -ForegroundColor Yellow
}

Write-Host "`n=== Verificação concluída ===" -ForegroundColor Green



