// src/modules/ProjectDetailsV2/hooks/useProjectClient.ts
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

interface ProjectClient {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  sector: string | null
}

export function useProjectClient(clientId: string | null) {
  const [client, setClient] = useState<ProjectClient | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!clientId) { setClient(null); return }
    setLoading(true)
    supabase
      .from('clients')
      .select('id, name, email, phone, address, sector')
      .eq('id', clientId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setClient(data as ProjectClient)
        setLoading(false)
      })
  }, [clientId])

  return { client, loading }
}
