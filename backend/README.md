# E-Nutri Backend

Backend FastAPI do sistema E-Nutri.

## Configuração

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

**IMPORTANTE**: Gere as chaves de segurança:
```bash
# SECRET_KEY e JWT_SECRET_KEY: qualquer string aleatória longa
# ENCRYPTION_KEY: gere com Python
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

3. Execute as migrations:
```bash
alembic upgrade head
```

4. Execute o seed (opcional):
```bash
python scripts/seed.py
```

5. Inicie o servidor:
```bash
uvicorn app.main:app --reload
```

## Estrutura

- `app/`: Código da aplicação
  - `models.py`: Modelos SQLModel
  - `schemas.py`: Schemas Pydantic
  - `routers/`: Rotas da API
  - `security.py`: Autenticação e criptografia
  - `utils.py`: Funções utilitárias
- `alembic/`: Migrations do banco de dados
- `scripts/`: Scripts auxiliares (seed, etc)

## API

Documentação interativa disponível em `/docs` quando o servidor estiver rodando.

