'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserCategory } from '@/types'

export function useCategories() {
  const [categories, setCategories] = useState<UserCategory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_categories')
        .select('*')
        .order('name')
      if (!error && data) setCategories(data as UserCategory[])
    } catch {
      // silently ignore if table doesn't exist yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  async function createCategory(name: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('user_categories').insert({
      user_id: user!.id,
      name: name.trim(),
    })
    if (!error) fetchCategories()
    return { error }
  }

  async function deleteCategory(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('user_categories').delete().eq('id', id)
    if (!error) fetchCategories()
    return { error }
  }

  return { categories, loading, createCategory, deleteCategory, refetch: fetchCategories }
}
