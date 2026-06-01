'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction, TransactionFormData, TransactionFilters } from '@/types'

export function useTransactions(filters: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    // Month/year filter
    const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
    const endDate = new Date(filters.year, filters.month, 0)
    const endDateStr = `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`
    query = query.gte('date', startDate).lte('date', endDateStr)

    if (filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters.search.trim()) {
      query = query.ilike('description', `%${filters.search.trim()}%`)
    }

    const { data, error: fetchError } = await query
    if (fetchError) {
      setError(fetchError.message)
    } else if (data) {
      setTransactions(data as Transaction[])
    }
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  async function createTransaction(data: TransactionFormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const totalAmount = parseFloat(data.amount)
    const installmentCount = data.payment_method === 'crédito'
      ? Math.max(1, parseInt(data.installments) || 1)
      : 1

    if (data.payment_method === 'crédito' && installmentCount > 1) {
      // Create one transaction per installment, distributed across months
      const amountPerInstallment = Math.round((totalAmount / installmentCount) * 100) / 100
      const startDate = new Date(data.date + 'T12:00:00')

      const inserts = Array.from({ length: installmentCount }, (_, i) => {
        const d = new Date(startDate)
        d.setMonth(d.getMonth() + i)
        return {
          user_id: user!.id,
          description: `${data.description} (${i + 1}/${installmentCount})`,
          amount: amountPerInstallment,
          date: d.toISOString().split('T')[0],
          type: data.type,
          category: data.category,
          payment_method: data.payment_method,
          installments: installmentCount,
        }
      })

      const { error } = await supabase.from('transactions').insert(inserts)
      if (!error) fetchTransactions()
      return { error }
    }

    // Single transaction (non-parcelas)
    const { error } = await supabase.from('transactions').insert({
      user_id: user!.id,
      description: data.description,
      amount: totalAmount,
      date: data.date,
      type: data.type,
      category: data.category,
      payment_method: data.payment_method,
      installments: 1,
    })
    if (!error) fetchTransactions()
    return { error }
  }

  async function updateTransaction(id: string, data: TransactionFormData) {
    const supabase = createClient()
    const { error } = await supabase
      .from('transactions')
      .update({
        description: data.description,
        amount: parseFloat(data.amount),
        date: data.date,
        type: data.type,
        category: data.category,
        payment_method: data.payment_method,
        installments: data.payment_method === 'parcelas' ? Math.max(2, parseInt(data.installments) || 2) : 1,
      })
      .eq('id', id)
    if (!error) fetchTransactions()
    return { error }
  }

  async function deleteTransaction(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) fetchTransactions()
    return { error }
  }

  return { transactions, loading, error, createTransaction, updateTransaction, deleteTransaction, refetch: fetchTransactions }
}
