'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { useTransactions } from '@/hooks/useTransactions'
import { CATEGORY_COLORS, Category, CategoryData, MonthlySummary } from '@/types'

export default function DashboardPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const filters = useMemo(
    () => ({ month, year, category: 'all' as const, search: '' }),
    [month, year],
  )

  const { transactions, loading } = useTransactions(filters)

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const summary: MonthlySummary = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses }
  }, [transactions])

  const expenseByCategory: CategoryData[] = useMemo(() => {
    const map = new Map<Category, number>()
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    })
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name],
    }))
  }, [transactions])

  const incomeByCategory: CategoryData[] = useMemo(() => {
    const map = new Map<Category, number>()
    transactions.filter((t) => t.type === 'income').forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    })
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name],
    }))
  }, [transactions])

  const monthLabel = format(new Date(year, month - 1, 1), 'MMMM yyyy', { locale: ptBR })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Resumo financeiro do período</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize min-w-[130px] text-center">
            {monthLabel}
          </span>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl border bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <SummaryCards summary={summary} />
      )}

      {/* Charts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-72 rounded-xl border bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryPieChart
            data={expenseByCategory}
            title="Despesas por Categoria"
            description="Distribuição dos seus gastos no período"
          />
          <CategoryPieChart
            data={incomeByCategory}
            title="Receitas por Categoria"
            description="Distribuição das suas entradas no período"
          />
        </div>
      )}

      {/* Recent transactions */}
      {loading ? (
        <div className="h-64 rounded-xl border bg-muted animate-pulse" />
      ) : (
        <RecentTransactions transactions={transactions} />
      )}
    </div>
  )
}
