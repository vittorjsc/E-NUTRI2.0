# Guia de Instalação - E-Nutri 2.0

## 📋 Pré-requisitos

### 1. Python (✅ Já instalado - versão 3.14.2)

### 2. Node.js e npm (❌ Precisa instalar)

**Opção A: Download direto (Recomendado)**
1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (Long Term Support)
3. Execute o instalador
4. Marque a opção "Add to PATH" durante a instalação
5. Reinicie o terminal/PowerShell após instalar

**Opção B: Via Chocolatey (se tiver instalado)**
```powershell
choco install nodejs-lts
```

**Opção C: Via Winget (Windows 10/11)**
```powershell
winget install OpenJS.NodeJS.LTS
```

### 3. Verificar instalação

Após instalar Node.js, abra um NOVO terminal e execute:
```powershell
node --version
npm --version
```

---

## 🐍 Instalação do Backend (Python)

### Passo 1: Navegar para a pasta do backend
```powershell
cd backend
```

### Passo 2: Criar ambiente virtual
```powershell
python -m venv venv
```

### Passo 3: Ativar ambiente virtual
```powershell
# No PowerShell:
.\venv\Scripts\Activate.ps1

# Se der erro de política de execução, execute primeiro:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Passo 4: Instalar dependências
```powershell
pip install -r requirements.txt
```

### Passo 5: Configurar variáveis de ambiente
```powershell
# Copie o arquivo de exemplo
Copy-Item env.example.txt .env

# Edite o .env e adicione as chaves (veja abaixo)
```

**IMPORTANTE: Gerar chaves de segurança**

Abra um novo terminal Python e execute:
```python
from cryptography.fernet import Fernet
print("ENCRYPTION_KEY=" + Fernet.generate_key().decode())
```

Copie o valor gerado e cole no arquivo `.env` na linha `ENCRYPTION_KEY=`

Para `SECRET_KEY` e `JWT_SECRET_KEY`, use qualquer string aleatória longa, por exemplo:
```
SECRET_KEY=seu-secret-key-aqui-mude-em-producao
JWT_SECRET_KEY=seu-jwt-secret-key-aqui-mude-em-producao
```

### Passo 6: Executar migrations
```powershell
alembic upgrade head
```

### Passo 7: Criar dados de exemplo (opcional)
```powershell
python scripts/seed.py
```

### Passo 8: Iniciar servidor
```powershell
uvicorn app.main:app --reload
```

O backend estará disponível em: http://localhost:8000
Documentação da API: http://localhost:8000/docs

---

## ⚛️ Instalação do Frontend (Next.js)

### Passo 1: Navegar para a pasta do frontend
```powershell
cd frontend
```

### Passo 2: Instalar dependências
```powershell
npm install
```

**Se der erro de permissão ou timeout:**
```powershell
# Tente com cache limpo:
npm cache clean --force
npm install

# Ou use yarn (se tiver instalado):
yarn install
```

### Passo 3: Configurar variáveis de ambiente
```powershell
# Crie o arquivo .env.local
New-Item -Path .env.local -ItemType File

# Adicione o conteúdo:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

Ou crie manualmente o arquivo `.env.local` com:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Passo 4: Iniciar servidor de desenvolvimento
```powershell
npm run dev
```

O frontend estará disponível em: http://localhost:3000

---

## 🚀 Executar o Sistema Completo

### Terminal 1 - Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```

---

## ❌ Problemas Comuns

### Erro: "node não é reconhecido"
- **Solução**: Instale Node.js e reinicie o terminal

### Erro: "pip não é reconhecido"
- **Solução**: Use `python -m pip` ao invés de `pip`

### Erro: "Execution Policy" no PowerShell
- **Solução**: Execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: "Cannot find module 'react'"
- **Solução**: Execute `npm install` na pasta frontend

### Erro: Porta já em uso
- **Solução**: Mude a porta ou feche o processo que está usando a porta

### Erro ao instalar dependências Python
- **Solução**: Atualize o pip:
```powershell
python -m pip install --upgrade pip
```

---

## 📝 Credenciais de Exemplo

Após executar o seed:
- **Email**: nutri@example.com
- **Senha**: nutri123

---

## 🆘 Precisa de Ajuda?

Se ainda tiver problemas, verifique:
1. ✅ Python 3.11+ instalado
2. ✅ Node.js 18+ instalado
3. ✅ Ambiente virtual ativado (backend)
4. ✅ Dependências instaladas
5. ✅ Arquivos .env configurados
6. ✅ Migrations executadas



