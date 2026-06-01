'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction, TransactionFormData, TransactionFilters } from '@/types'

export function useTransactions(filters: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
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

    const { data, error } = await query
    if (!error && data) setTransactions(data as Transaction[])
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  async function createTransaction(data: TransactionFormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('transactions').insert({
      user_id: user!.id,
      description: data.description,
      amount: parseFloat(data.amount),
      date: data.date,
      type: data.type,
      category: data.category,
      payment_method: data.payment_method,
      installments: data.payment_method === 'parcelas' ? parseInt(data.installments) || 2 : 1,
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
        installments: data.payment_method === 'parcelas' ? parseInt(data.installments) || 2 : 1,
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

  return { transactions, loading, createTransaction, updateTransaction, deleteTransaction, refetch: fetchTransactions }
}
