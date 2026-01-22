# Script para corrigir política de execução do PowerShell
Write-Host "=== Corrigindo Política de Execução do PowerShell ===" -ForegroundColor Green

Write-Host "`nVerificando política atual..." -ForegroundColor Yellow
$currentPolicy = Get-ExecutionPolicy
Write-Host "Política atual: $currentPolicy" -ForegroundColor Cyan

Write-Host "`nAlterando política para RemoteSigned..." -ForegroundColor Yellow
Write-Host "(Isso permite executar scripts locais e scripts baixados assinados)" -ForegroundColor Gray

try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "✅ Política alterada com sucesso!" -ForegroundColor Green
    
    Write-Host "`nVerificando nova política..." -ForegroundColor Yellow
    $newPolicy = Get-ExecutionPolicy
    Write-Host "Nova política: $newPolicy" -ForegroundColor Green
    
    Write-Host "`nTestando npm..." -ForegroundColor Yellow
    npm --version
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ npm está funcionando!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ npm ainda não está funcionando. Tente reiniciar o terminal." -ForegroundColor Yellow
    }
} catch {
    Write-Host "`n❌ Erro ao alterar política!" -ForegroundColor Red
    Write-Host "Tente executar como Administrador:" -ForegroundColor Yellow
    Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Cyan
}

Write-Host "`n=== Concluído ===" -ForegroundColor Green
Write-Host "`nSe ainda não funcionar, REINICIE o terminal e tente novamente." -ForegroundColor Yellow


