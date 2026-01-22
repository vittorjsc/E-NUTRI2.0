# Como Criar um Novo Repositório e Enviar o Projeto

## Método 1: Via Interface do GitHub (Mais Fácil)

### Passo 1: Criar o Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `E-NUTRI2.0` (ou outro nome de sua preferência)
   - **Description**: `Sistema completo de gerenciamento de pacientes para nutricionistas`
   - **Visibility**: Escolha **Public** ou **Private**
   - **NÃO marque** "Add a README file"
   - **NÃO marque** "Add .gitignore"
   - **NÃO marque** "Choose a license"
3. Clique em **"Create repository"**

### Passo 2: Copiar a URL do Repositório

Após criar, você verá uma página com instruções. Copie a URL do repositório, será algo como:
- `https://github.com/vittorjsc/E-NUTRI2.0.git`

### Passo 3: Executar os Comandos

Abra o terminal no Cursor (ou PowerShell) no diretório do projeto e execute:

```bash
git init
git remote add origin https://github.com/vittorjsc/SEU-NOVO-REPOSITORIO.git
git add .
git commit -m "Initial commit: E-Nutri 2.0 - Sistema completo"
git branch -M main
git push -u origin main
```

**Substitua `SEU-NOVO-REPOSITORIO` pelo nome real do repositório que você criou!**

---

## Método 2: Via GitHub CLI (Se Instalado)

Se você tiver o GitHub CLI instalado, execute:

```bash
gh repo create E-NUTRI2.0 --public --source=. --remote=origin --push
```

Isso vai:
- ✅ Criar o repositório no GitHub
- ✅ Configurar o remote
- ✅ Fazer push de todos os arquivos

---

## Método 3: Script Automático

Execute o script que criei:

```powershell
.\CRIAR-E-ENVIAR.ps1
```

O script vai guiar você passo a passo.

---

## ⚠️ Se Der Erro de Autenticação

### Opção A: Personal Access Token

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" > "Generate new token (classic)"
3. Dê um nome: `E-Nutri`
4. Marque a opção **"repo"** (todas as permissões de repositório)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você só verá uma vez!)

7. Quando pedir senha, use o token ao invés da senha

### Opção B: GitHub CLI

```bash
gh auth login
```

Siga as instruções na tela.

---

## ✅ Verificar se Funcionou

Após o push, acesse seu repositório no GitHub:
`https://github.com/vittorjsc/SEU-REPOSITORIO`

Você deve ver todos os arquivos do projeto lá!

---

## 📝 Estrutura que Será Enviada

O projeto inclui:
- ✅ Backend completo (FastAPI)
- ✅ Frontend completo (Next.js)
- ✅ Documentação (README.md)
- ✅ Scripts de instalação
- ✅ Configurações (.gitignore)

**NÃO será enviado:**
- ❌ `node_modules/` (muito grande, será instalado depois)
- ❌ `.env` (arquivos sensíveis)
- ❌ Arquivos temporários

