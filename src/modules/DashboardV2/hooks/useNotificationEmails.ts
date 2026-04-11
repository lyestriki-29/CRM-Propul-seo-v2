import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface NotificationEmail {
  id: string
  email: string
  label: string | null
  active: boolean
  created_at: string
}

export function useNotificationEmails() {
  const [emails, setEmails] = useState<NotificationEmail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmails = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('notification_emails')
      .select('*')
      .order('created_at', { ascending: true })
    setEmails((data as NotificationEmail[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchEmails() }, [fetchEmails])

  const addEmail = useCallback(async (email: string, label: string) => {
    const { error } = await supabase
      .from('notification_emails')
      .insert({ email: email.trim().toLowerCase(), label: label.trim() || null })
    if (!error) await fetchEmails()
    return !error
  }, [fetchEmails])

  const toggleEmail = useCallback(async (id: string, active: boolean) => {
    await supabase
      .from('notification_emails')
      .update({ active })
      .eq('id', id)
    setEmails(prev => prev.map(e => e.id === id ? { ...e, active } : e))
  }, [])

  const deleteEmail = useCallback(async (id: string) => {
    await supabase
      .from('notification_emails')
      .delete()
      .eq('id', id)
    setEmails(prev => prev.filter(e => e.id !== id))
  }, [])

  return { emails, loading, addEmail, toggleEmail, deleteEmail, refresh: fetchEmails }
}
