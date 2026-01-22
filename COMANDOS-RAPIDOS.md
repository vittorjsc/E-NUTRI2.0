# Comandos Rápidos para Enviar ao GitHub

## Se você JÁ criou o repositório no GitHub:

Substitua `SEU-REPOSITORIO` pela URL real do seu repositório:

```bash
git init
git remote add origin https://github.com/vittorjsc/SEU-REPOSITORIO.git
git add .
git commit -m "Initial commit: E-Nutri 2.0"
git branch -M main
git push -u origin main
```

---

## Se você AINDA NÃO criou o repositório:

### Passo 1: Criar no GitHub
1. Vá em: https://github.com/new
2. Nome: `E-NUTRI2.0` (ou outro)
3. **NÃO marque** README, .gitignore ou license
4. Clique em "Create repository"

### Passo 2: Copiar a URL
Copie a URL que aparece (ex: `https://github.com/vittorjsc/E-NUTRI2.0.git`)

### Passo 3: Executar os comandos acima
Substitua `SEU-REPOSITORIO` pela URL que você copiou.

---

## Autenticação

Se pedir login:
- **Username**: seu usuário do GitHub
- **Password**: use um **Personal Access Token** (não sua senha)

Para criar token:
1. https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Marque "repo"
4. Copie o token e use como senha

---

## Script Automático

Ou simplesmente execute:
```powershell
.\CRIAR-E-ENVIAR.ps1
```

O script vai guiar você!

