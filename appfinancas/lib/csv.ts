import { Transaction } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function exportToCSV(transactions: Transaction[], filename = 'transacoes') {
  const headers = ['Descrição', 'Valor', 'Tipo', 'Categoria', 'Data']

  const rows = transactions.map((t) => [
    `"${t.description}"`,
    t.amount.toFixed(2).replace('.', ','),
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.category,
    format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR }),
  ])

  const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n')

  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
