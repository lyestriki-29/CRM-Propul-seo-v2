// src/modules/DashboardV2/hooks/useUnreadEmails.ts
// Emails Gmail reçus non répondus (is_replied !== true) depuis v2.project_activities
import { useState, useEffect, useCallback } from 'react'
import { v2 } from '../../../lib/supabase'

export interface UnreadEmail {
  id: string
  project_id: string | null
  content: string
  created_at: string
  metadata: {
    from?: string
    subject?: string
    is_unread?: boolean
    is_replied?: boolean
    gmail_message_id?: string
  }
}

export function useUnreadEmails() {
  const [emails, setEmails] = useState<UnreadEmail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEmails = useCallback(async () => {
    const { data } = await v2
      .from('project_activities')
      .select('id, project_id, content, created_at, metadata')
      .eq('type', 'email')
      .eq('is_auto', true)
      // Montre les emails non explicitement marqués comme répondus
      .not('metadata->>is_replied', 'eq', 'true')
      .order('created_at', { ascending: false })
      .limit(10)

    setEmails((data ?? []) as UnreadEmail[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  const markAsReplied = useCallback(async (id: string) => {
    // Optimistic update
    setEmails(prev => prev.filter(e => e.id !== id))

    const { data: current } = await v2
      .from('project_activities')
      .select('metadata')
      .eq('id', id)
      .single()

    const updatedMetadata = {
      ...((current as any)?.metadata ?? {}),
      is_replied: true,
      is_unread: false,
    }
    // Le type généré de v2.project_activities ne déclare pas metadata comme updatable
    // → on passe par le client non-typé pour cet update spécifique
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (v2 as any)
      .from('project_activities')
      .update({ metadata: updatedMetadata })
      .eq('id', id)
  }, [])

  return { emails, loading, markAsReplied, refetch: fetchEmails }
}
