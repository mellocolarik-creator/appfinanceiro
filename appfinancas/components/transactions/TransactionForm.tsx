'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Transaction,
  TransactionFormData,
  TransactionType,
  Category,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/types'

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  onSubmit: (data: TransactionFormData) => Promise<{ error: unknown }>
}

const DEFAULT: TransactionFormData = {
  description: '',
  amount: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'expense',
  category: 'Outros',
}

export function TransactionForm({ open, onOpenChange, transaction, onSubmit }: TransactionFormProps) {
  const [form, setForm] = useState<TransactionFormData>(DEFAULT)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: transaction.amount.toString(),
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
      })
    } else {
      setForm(DEFAULT)
    }
  }, [transaction, open])

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function set<K extends keyof TransactionFormData>(key: K, value: TransactionFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      // Reset category when type changes
      if (key === 'type') {
        const cats = value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
        if (!cats.includes(next.category)) next.category = cats[0]
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description.trim() || !form.amount || !form.date) return
    setLoading(true)
    const { error } = await onSubmit(form)
    setLoading(false)
    if (!error) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Type */}
          <div className="grid grid-cols-2 gap-2">
            {(['expense', 'income'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-rose-500 text-white border-rose-500'
                    : 'border-border text-muted-foreground hover:bg-accent'
                }`}
              >
                {t === 'income' ? 'Receita' : 'Despesa'}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço, Salário..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set('category', v as Category)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : transaction ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
