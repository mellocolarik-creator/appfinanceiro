export type TransactionType = 'income' | 'expense'

export type Category = string

export const DEFAULT_INCOME_CATEGORIES: string[] = ['Salário', 'Freelance', 'Outros']
export const DEFAULT_EXPENSE_CATEGORIES: string[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros',
]
export const CATEGORIES: string[] = [
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
export const INCOME_CATEGORIES: string[] = DEFAULT_INCOME_CATEGORIES
export const EXPENSE_CATEGORIES: string[] = DEFAULT_EXPENSE_CATEGORIES

export const CATEGORY_COLORS: Record<string, string> = {
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

export const CATEGORY_COLOR_FALLBACK = '#94a3b8'

export type PaymentMethod = 'dinheiro' | 'pix' | 'débito' | 'crédito'

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'débito', label: 'Cartão de Débito' },
  { value: 'crédito', label: 'Cartão de Crédito' },
]

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  date: string
  type: TransactionType
  category: string
  payment_method?: PaymentMethod
  installments?: number
  created_at: string
}

export interface TransactionFormData {
  description: string
  amount: string
  date: string
  type: TransactionType
  category: string
  payment_method: PaymentMethod
  installments: string
}

export interface TransactionFilters {
  month: number
  year: number
  category: string
  search: string
}

export interface MonthlySummary {
  totalIncome: number
  totalExpenses: number
  balance: number
}

export interface CategoryData {
  name: string
  value: number
  color: string
}

export interface UserCategory {
  id: string
  user_id: string
  name: string
  created_at: string
}
