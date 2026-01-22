# E-Nutri Frontend

Frontend Next.js do sistema E-Nutri.

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com a URL do backend
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura

- `app/`: Páginas e rotas (App Router)
- `components/`: Componentes React reutilizáveis
- `lib/`: Utilitários e configurações
  - `api.ts`: Cliente Axios configurado
  - `auth-context.tsx`: Context de autenticação
  - `utils.ts`: Funções utilitárias

## Build para Produção

```bash
npm run build
npm start
```

