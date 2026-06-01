'use client'

import { useMemo, useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useTransactions } from '@/hooks/useTransactions'
import { exportToCSV } from '@/lib/csv'
import { Transaction, TransactionFilters as Filters } from '@/types'

export default function TransactionsPage() {
  const now = new Date()
  const [filters, setFilters] = useState<Filters>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    category: 'all',
    search: '',
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const { transactions, loading, error, createTransaction, updateTransaction, deleteTransaction } =
    useTransactions(filters)

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions],
  )
  const totalExpenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions],
  )

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(t: Transaction) {
    setEditing(t)
    setFormOpen(true)
  }

  async function handleSubmit(data: Parameters<typeof createTransaction>[0]) {
    if (editing) {
      const result = await updateTransaction(editing.id, data)
      if (!result.error) toast.success('Transação atualizada!')
      else toast.error('Erro ao atualizar transação.')
      return result
    } else {
      const result = await createTransaction(data)
      if (!result.error) toast.success('Transação adicionada!')
      else toast.error('Erro ao adicionar transação.')
      return result
    }
  }

  function handleExport() {
    if (transactions.length === 0) {
      toast.error('Nenhuma transação para exportar.')
      return
    }
    exportToCSV(transactions)
    toast.success('CSV exportado com sucesso!')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Nova transação</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters filters={filters} onChange={setFilters} />

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Erro ao carregar transações: {error}
        </div>
      )}

      {/* Summary bar */}
      {!loading && transactions.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm">
          <span>
            <span className="text-muted-foreground">{transactions.length} transações · </span>
            <span className="text-emerald-600 font-medium">
              +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
            </span>
            <span className="text-muted-foreground"> receitas · </span>
            <span className="text-rose-600 font-medium">
              -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpenses)}
            </span>
            <span className="text-muted-foreground"> despesas</span>
          </span>
        </div>
      )}

      {/* List */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        onEdit={openEdit}
        onDelete={deleteTransaction}
      />

      {/* Form dialog */}
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editing}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
