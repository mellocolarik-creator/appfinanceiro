'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Transaction, PAYMENT_METHODS } from '@/types'
import { cn } from '@/lib/utils'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  onEdit: (t: Transaction) => void
  onDelete: (id: string) => Promise<{ error: unknown }>
}

export function TransactionList({ transactions, loading, onEdit, onDelete }: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function confirmDelete() {
    if (!deletingId) return
    const { error } = await onDelete(deletingId)
    setDeletingId(null)
    if (error) toast.error('Erro ao excluir transação.')
    else toast.success('Transação excluída.')
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl border bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-sm">Nenhuma transação encontrada</p>
        <p className="text-muted-foreground text-xs mt-1">
          Ajuste os filtros ou adicione uma nova transação
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-card hover:bg-accent/30 transition-colors group"
          >
            {/* Color indicator */}
            <div
              className={cn(
                'w-1 h-10 rounded-full shrink-0',
                t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500',
              )}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.description}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <Badge variant="secondary" className="text-xs font-normal h-5">
                  {t.category}
                </Badge>
                {t.payment_method && t.payment_method !== 'dinheiro' && (
                  <Badge variant="outline" className="text-xs font-normal h-5">
                    {t.payment_method === 'parcelas' && t.installments && t.installments > 1
                      ? `${t.installments}x ${PAYMENT_METHODS.find((m) => m.value === t.payment_method)?.label ?? t.payment_method}`
                      : PAYMENT_METHODS.find((m) => m.value === t.payment_method)?.label ?? t.payment_method}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(t.date + 'T00:00:00'), "d 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>

            {/* Amount */}
            <span
              className={cn(
                'text-sm font-bold shrink-0',
                t.type === 'income' ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              {t.type === 'income' ? '+' : '-'}
              {formatCurrency(t.amount)}
            </span>

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(t)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => setDeletingId(t.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
