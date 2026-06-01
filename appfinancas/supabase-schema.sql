-- FinançasFácil — Supabase Schema
-- Execute este script no SQL Editor do seu projeto Supabase

-- Tabela de transações
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount      numeric(12, 2) not null check (amount > 0),
  date        date not null,
  type        text not null check (type in ('income', 'expense')),
  category    text not null check (
    category in (
      'Alimentação', 'Transporte', 'Moradia', 'Lazer',
      'Saúde', 'Educação', 'Salário', 'Freelance', 'Outros'
    )
  ),
  created_at  timestamptz not null default now()
);

-- Index para queries filtradas por usuário + data
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);

-- Row Level Security
alter table public.transactions enable row level security;

-- Cada usuário só acessa suas próprias transações
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);
