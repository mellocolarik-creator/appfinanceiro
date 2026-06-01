import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Transaction } from '@/types'
import { cn } from '@/lib/utils'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 8)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Transações Recentes</CardTitle>
        <Link
          href="/transactions"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
        >
          Ver todas <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">
            Nenhuma transação neste período
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {t.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(t.date + 'T00:00:00'), "d 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold shrink-0',
                    t.type === 'income' ? 'text-emerald-600' : 'text-rose-600',
                  )}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
