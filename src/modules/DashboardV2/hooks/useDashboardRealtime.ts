import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../../lib/supabase'

export function useDashboardRealtime(onRefresh: () => void) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-v2-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects_v2' }, () => {
        onRefreshRef.current()
        setLastUpdatedAt(new Date())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        onRefreshRef.current()
        setLastUpdatedAt(new Date())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        onRefreshRef.current()
        setLastUpdatedAt(new Date())
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_activities_v2' }, () => {
        onRefreshRef.current()
        setLastUpdatedAt(new Date())
      })
      .subscribe(status => {
        const connected = status === 'SUBSCRIBED'
        setIsConnected(connected)
        // Masquer le bandeau dès que la connexion est rétablie
        if (connected) setLastUpdatedAt(null)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { isConnected, lastUpdatedAt }
}
