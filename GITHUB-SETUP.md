# Como Enviar o Código para o GitHub

## Método 1: Usando o Script Automático (Recomendado)

Execute o script PowerShell:

```powershell
.\push-github.ps1
```

O script irá:
1. ✅ Inicializar o repositório Git (se necessário)
2. ✅ Adicionar o remote do GitHub
3. ✅ Adicionar todos os arquivos
4. ✅ Fazer commit
5. ✅ Fazer push para o GitHub

---

## Método 2: Manual (Passo a Passo)

### 1. Inicializar Git
```powershell
git init
```

### 2. Adicionar Remote
```powershell
git remote add origin https://github.com/vittorjsc/E-NUTRI2.0.git
```

### 3. Adicionar Arquivos
```powershell
git add .
```

### 4. Fazer Commit
```powershell
git commit -m "Initial commit: E-Nutri 2.0 - Sistema completo de gerenciamento de pacientes para nutricionistas"
```

### 5. Renomear Branch
```powershell
git branch -M main
```

### 6. Fazer Push
```powershell
git push -u origin main
```

---

## ⚠️ Autenticação no GitHub

Se der erro de autenticação, você precisa configurar:

### Opção A: Personal Access Token (Recomendado)

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" > "Generate new token (classic)"
3. Dê um nome (ex: "E-Nutri")
4. Marque a opção **"repo"** (acesso completo aos repositórios)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você só verá uma vez!)

7. Use o token no lugar da senha:
```powershell
# Quando pedir credenciais:
# Username: seu-usuario-github
# Password: cole-o-token-aqui
```

### Opção B: GitHub CLI

Instale o GitHub CLI:
```powershell
winget install GitHub.cli
```

Depois faça login:
```powershell
gh auth login
```

### Opção C: SSH (Avançado)

1. Gere uma chave SSH:
```powershell
ssh-keygen -t ed25519 -C "seu-email@example.com"
```

2. Adicione a chave ao GitHub:
   - Copie o conteúdo de `~/.ssh/id_ed25519.pub`
   - Vá em: https://github.com/settings/keys
   - Clique em "New SSH key"
   - Cole a chave

3. Mude o remote para SSH:
```powershell
git remote set-url origin git@github.com:vittorjsc/E-NUTRI2.0.git
```

---

## 🔍 Verificar Status

Para ver o status do repositório:
```powershell
git status
```

Para ver os remotes configurados:
```powershell
git remote -v
```

---

## 📝 Próximos Commits

Após o commit inicial, para fazer novos commits:

```powershell
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## ❌ Problemas Comuns

### Erro: "Repository not found"
- Verifique se o repositório existe no GitHub
- Verifique se você tem permissão de escrita

### Erro: "Authentication failed"
- Configure um Personal Access Token
- Ou use GitHub CLI: `gh auth login`

### Erro: "Updates were rejected"
- O repositório no GitHub tem conteúdo diferente
- Execute: `git pull origin main --allow-unrelated-histories`
- Depois: `git push -u origin main`

### Erro: "Permission denied"
- Verifique suas credenciais
- Use um token ao invés de senha

---

## ✅ Verificar se Funcionou

Após o push, acesse:
https://github.com/vittorjsc/E-NUTRI2.0

Você deve ver todos os arquivos do projeto lá!


