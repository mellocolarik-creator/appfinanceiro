import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthlySummary } from '@/types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

interface SummaryCardsProps {
  summary: MonthlySummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Receitas',
      value: summary.totalIncome,
      icon: TrendingUp,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Despesas',
      value: summary.totalExpenses,
      icon: TrendingDown,
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-50 dark:bg-rose-950/30',
    },
    {
      title: 'Saldo',
      value: summary.balance,
      icon: Wallet,
      colorClass: summary.balance >= 0 ? 'text-primary' : 'text-rose-500',
      bgClass: 'bg-primary/5 dark:bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bgClass}`}>
              <card.icon className={`h-5 w-5 ${card.colorClass}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${card.colorClass}`}>
              {formatCurrency(card.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
