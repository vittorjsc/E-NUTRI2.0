# E-Nutri 2.0

Sistema completo de gerenciamento de pacientes para nutricionistas, com foco em segurança, LGPD compliance e experiência do usuário.

## 🏗️ Arquitetura

### Stack Tecnológica

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Python 3.11+ + FastAPI + SQLModel + Pydantic
- **Database**: PostgreSQL (produção) / SQLite (desenvolvimento)
- **Migrations**: Alembic
- **Autenticação**: JWT (Access + Refresh tokens)
- **Criptografia**: Fernet (para dados sensíveis como CPF)

### Estrutura do Projeto

```
/
├── frontend/          # Next.js App Router
├── backend/           # FastAPI
├── README.md
└── .gitignore
```

## 🔐 Segurança e LGPD

- **CPF**: Armazenado criptografado (Fernet), exibido mascarado na UI
- **Autorização**: Validação de ownership por tenant (professional_id)
- **Senhas**: Hash bcrypt
- **Tokens**: JWT com expiração e refresh
- **Logs**: Sem dados sensíveis

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL (opcional, SQLite funciona para dev)

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

5. Execute as migrations:
```bash
alembic upgrade head
```

5. Execute os seeds (cria profissional e pacientes de exemplo):
```bash
python scripts/seed.py
```

6. Inicie o servidor:
```bash
uvicorn app.main:app --reload
```

O backend estará disponível em `http://localhost:8000`
API docs em `http://localhost:8000/docs`

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com a URL do backend
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📊 Configuração do Banco de Dados

### Desenvolvimento (SQLite)

Por padrão, o sistema usa SQLite em desenvolvimento. Nenhuma configuração adicional é necessária.

### Produção (PostgreSQL)

1. Crie um banco PostgreSQL
2. Configure a variável `DATABASE_URL` no `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/enutri
```

3. Execute as migrations:
```bash
alembic upgrade head
```

## 🔄 Migrations

### Criar nova migration:
```bash
cd backend
alembic revision --autogenerate -m "descrição da mudança"
```

### Aplicar migrations:
```bash
alembic upgrade head
```

### Reverter migration:
```bash
alembic downgrade -1
```

## 🚢 Deploy

### Backend (Render ou Fly.io)

#### Opção 1: Render

1. Crie uma conta no [Render](https://render.com)
2. Crie um novo "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command**: `cd backend && pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `DATABASE_URL`: URL do PostgreSQL (Render oferece banco gratuito)
     - `SECRET_KEY`: Gere uma chave secreta forte
     - `ENCRYPTION_KEY`: Gere uma chave Fernet (use `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`)
     - `JWT_SECRET_KEY`: Chave para assinatura JWT
     - `JWT_ALGORITHM`: `HS256`
     - `CORS_ORIGINS`: URL do frontend (ex: `https://e-nutri.vercel.app`)

#### Opção 2: Fly.io

1. Instale o Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Faça login: `fly auth login`
3. Crie o app: `fly launch` (na pasta backend)
4. Configure as variáveis de ambiente: `fly secrets set KEY=value`
5. Deploy: `fly deploy`

### Frontend (Vercel)

1. Crie uma conta no [Vercel](https://vercel.com)
2. Importe seu repositório GitHub
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: URL do backend deployado
4. Deploy automático a cada push na branch main

## 🔑 Variáveis de Ambiente

### Backend (.env)

```env
# Database
DATABASE_URL=sqlite:///./enutri.db  # ou postgresql://...

# Security
SECRET_KEY=your-secret-key-here
ENCRYPTION_KEY=your-fernet-key-here
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Seeds

O script de seed cria:
- 1 profissional de exemplo (email: `nutri@example.com`, senha: `nutri123`)
- 2 pacientes de exemplo com check-ins

Execute:
```bash
cd backend
python scripts/seed.py
```

## 🧪 Testes

### Backend

```bash
cd backend
pytest
```

## 📋 Funcionalidades

- ✅ Autenticação e autorização por profissional
- ✅ Cadastro e gerenciamento de pacientes
- ✅ Cálculo automático de IMC
- ✅ Templates de recomendações personalizáveis
- ✅ Consultas de retorno (check-ins)
- ✅ Linha do tempo e gráficos de evolução
- ✅ Sugestão de próximo retorno baseada em regras
- ✅ Busca e filtros de pacientes
- ✅ Interface responsiva e moderna

## 🔜 Próximos Passos

- [ ] Multi-clínica (profissionais podem trabalhar em múltiplas clínicas)
- [ ] Sistema de permissões (assistente, nutricionista, admin)
- [ ] Exportação de PDF melhorada (com gráficos e templates)
- [ ] Notificações (email/SMS) para retornos próximos
- [ ] Integração com balanças e equipamentos
- [ ] App mobile (React Native)
- [ ] Dashboard com analytics avançados
- [ ] Templates compartilháveis entre profissionais
- [ ] Histórico de alterações (audit log)
- [ ] Backup automático e restore

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

