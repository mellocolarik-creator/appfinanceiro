'use client'

import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionFilters as Filters, CATEGORIES } from '@/types'
import { useCategories } from '@/hooks/useCategories'

interface TransactionFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  const { categories: userCategories } = useCategories()

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value })
  }

  function prevMonth() {
    if (filters.month === 1) onChange({ ...filters, month: 12, year: filters.year - 1 })
    else set('month', filters.month - 1)
  }

  function nextMonth() {
    if (filters.month === 12) onChange({ ...filters, month: 1, year: filters.year + 1 })
    else set('month', filters.month + 1)
  }

  const monthLabel = format(new Date(filters.year, filters.month - 1, 1), 'MMMM yyyy', { locale: ptBR })

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Month selector */}
      <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium capitalize min-w-[120px] text-center">
          {monthLabel}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Category */}
      <Select value={filters.category} onValueChange={(v) => v && set('category', v)}>
        <SelectTrigger className="w-40 h-9">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
          {userCategories.map((c) => (
            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por descrição..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="pl-9 h-9"
        />
        {filters.search && (
          <button
            onClick={() => set('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
