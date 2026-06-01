export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Alimentação'
  | 'Transporte'
  | 'Moradia'
  | 'Lazer'
  | 'Saúde'
  | 'Educação'
  | 'Salário'
  | 'Freelance'
  | 'Outros'

export const CATEGORIES: Category[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Freelance',
  'Outros',
]

export const INCOME_CATEGORIES: Category[] = ['Salário', 'Freelance', 'Outros']
export const EXPENSE_CATEGORIES: Category[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
]

export const CATEGORY_COLORS: Record<Category, string> = {
  Alimentação: '#f97316',
  Transporte: '#3b82f6',
  Moradia: '#8b5cf6',
  Lazer: '#ec4899',
  Saúde: '#22c55e',
  Educação: '#eab308',
  Salário: '#06b6d4',
  Freelance: '#14b8a6',
  Outros: '#94a3b8',
}

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  date: string
  type: TransactionType
  category: Category
  created_at: string
}

export interface TransactionFormData {
  description: string
  amount: string
  date: string
  type: TransactionType
  category: Category
}

export interface TransactionFilters {
  month: number
  year: number
  category: Category | 'all'
  search: string
}

export interface MonthlySummary {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export interface CategoryData {
  name: Category
  value: number
  color: string
}
