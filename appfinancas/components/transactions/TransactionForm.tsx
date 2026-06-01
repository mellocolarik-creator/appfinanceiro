'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Plus, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
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
  PaymentMethod,
  PAYMENT_METHODS,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '@/types'
import { useCategories } from '@/hooks/useCategories'

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
  payment_method: 'dinheiro',
  installments: '2',
}

export function TransactionForm({ open, onOpenChange, transaction, onSubmit }: TransactionFormProps) {
  const [form, setForm] = useState<TransactionFormData>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [savingCategory, setSavingCategory] = useState(false)
  const [managingCategories, setManagingCategories] = useState(false)

  const { categories: userCategories, createCategory, deleteCategory } = useCategories()

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: transaction.amount.toString(),
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        payment_method: transaction.payment_method ?? 'dinheiro',
        installments: (transaction.installments ?? 2).toString(),
      })
    } else {
      setForm(DEFAULT)
    }
    setAddingCategory(false)
    setNewCategoryName('')
    setManagingCategories(false)
  }, [transaction, open])

  const defaultCategories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function set<K extends keyof TransactionFormData>(key: K, value: TransactionFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'type') {
        const cats = value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
        if (!cats.includes(next.category) && !userCategories.some((c) => c.name === next.category)) {
          next.category = cats[0]
        }
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

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return
    setSavingCategory(true)
    const { error } = await createCategory(newCategoryName)
    setSavingCategory(false)
    if (error) {
      toast.error('Erro ao criar categoria.')
    } else {
      set('category', newCategoryName.trim())
      setNewCategoryName('')
      setAddingCategory(false)
      toast.success('Categoria criada!')
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    const { error } = await deleteCategory(id)
    if (error) {
      toast.error('Erro ao excluir categoria.')
    } else {
      if (form.category === name) set('category', defaultCategories[0])
      toast.success('Categoria excluída.')
    }
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
            <div className="flex items-center justify-between">
              <Label>Categoria</Label>
              <div className="flex gap-2">
                {userCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setManagingCategories(!managingCategories)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Gerenciar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setAddingCategory(!addingCategory); setManagingCategories(false) }}
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Nova
                </button>
              </div>
            </div>

            <Select value={form.category} onValueChange={(v) => v && set('category', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Padrão</SelectLabel>
                  {defaultCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectGroup>
                {userCategories.length > 0 && (
                  <>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Personalizadas</SelectLabel>
                      {userCategories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>

            {/* Inline add category */}
            {addingCategory && (
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Nome da categoria"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  className="h-8 px-3"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || savingCategory}
                >
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => { setAddingCategory(false); setNewCategoryName('') }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {/* Manage custom categories */}
            {managingCategories && userCategories.length > 0 && (
              <div className="border rounded-lg p-2 space-y-1 mt-1">
                {userCategories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-0.5">
                    <span className="text-sm">{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment method */}
          <div className="space-y-1.5">
            <Label>Forma de pagamento</Label>
            <Select value={form.payment_method} onValueChange={(v) => set('payment_method', v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Installments (only for parcelas) */}
          {form.payment_method === 'parcelas' && (
            <div className="space-y-1.5">
              <Label htmlFor="installments">Número de parcelas</Label>
              <Input
                id="installments"
                type="number"
                min="2"
                max="48"
                value={form.installments}
                onChange={(e) => set('installments', e.target.value)}
              />
            </div>
          )}

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
