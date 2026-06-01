# FinançasFácil — Setup

## 1. Clonar e instalar dependências

```bash
npm install
```

## 2. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 3. Criar tabela no Supabase

No painel do Supabase, vá em **SQL Editor** e execute o conteúdo de `supabase-schema.sql`.

Isso cria:
- Tabela `transactions` com todos os campos necessários
- Índices de performance
- Row Level Security (cada usuário vê apenas suas próprias transações)

## 4. Habilitar autenticação por e-mail/senha

No painel do Supabase:
- Vá em **Authentication → Providers**
- Certifique-se que **Email** está habilitado

## 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 6. Deploy na Vercel

1. Push do repositório para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy automático

## Estrutura de pastas

```
app/
  page.tsx              — Landing page pública
  login/                — Página de login
  register/             — Página de cadastro
  (app)/
    layout.tsx          — Layout autenticado (sidebar + header)
    dashboard/          — Dashboard com cards e gráficos
    transactions/       — CRUD de transações com filtros e CSV

components/
  layout/               — Sidebar e Header
  dashboard/            — Cards, gráfico de pizza, transações recentes
  transactions/         — Lista, formulário e filtros de transações
  ui/                   — Componentes shadcn/ui

lib/
  supabase/             — Clientes browser e server-side
  csv.ts                — Exportação de CSV

hooks/
  useTransactions.ts    — Hook de CRUD e busca de transações

types/index.ts          — Tipos TypeScript compartilhados
supabase-schema.sql     — Schema SQL para executar no Supabase
```
