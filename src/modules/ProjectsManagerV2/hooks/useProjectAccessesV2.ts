import { useState, useEffect, useCallback } from 'react'
import { v2 } from '../../../lib/supabase'
import type { AccessCategory, AccessStatus } from '../../../types/project-v2'

export interface ProjectAccessV2 {
  id: string
  project_id: string
  category: AccessCategory
  label: string
  url?: string | null
  login?: string | null
  password?: string | null
  notes?: string | null
  status: AccessStatus
  provided_by?: string | null
  expires_at?: string | null
  created_at: string
  updated_at: string
}

interface UseProjectAccessesV2Return {
  accesses: ProjectAccessV2[]
  loading: boolean
  addAccess: (data: Omit<ProjectAccessV2, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateAccess: (id: string, updates: Partial<ProjectAccessV2>) => Promise<void>
  deleteAccess: (id: string) => Promise<void>
}

export function useProjectAccessesV2(projectId: string): UseProjectAccessesV2Return {
  const [accesses, setAccesses] = useState<ProjectAccessV2[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    v2
      .from('project_accesses')
      .select('*')
      .eq('project_id', projectId)
      .order('category', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('[useProjectAccessesV2] fetch error:', error.message, error)
        if (!error && data) setAccesses(data as ProjectAccessV2[])
        setLoading(false)
      })
  }, [projectId])

  const addAccess = useCallback(async (data: Omit<ProjectAccessV2, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: created, error } = await v2
      .from('project_accesses')
      .insert({ ...data, project_id: projectId })
      .select('*')
      .single()
    if (error) console.error('[useProjectAccessesV2] insert error:', error.message, error)
    if (!error && created) setAccesses(prev => [...prev, created as ProjectAccessV2])
  }, [projectId])

  const updateAccess = useCallback(async (id: string, updates: Partial<ProjectAccessV2>) => {
    const { data, error } = await v2
      .from('project_accesses')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()
    if (error) console.error('[useProjectAccessesV2] update error:', error.message, error)
    if (!error && data) setAccesses(prev => prev.map(a => a.id === id ? data as ProjectAccessV2 : a))
  }, [])

  const deleteAccess = useCallback(async (id: string) => {
    const { error } = await v2.from('project_accesses').delete().eq('id', id)
    if (error) console.error('[useProjectAccessesV2] delete error:', error.message, error)
    if (!error) setAccesses(prev => prev.filter(a => a.id !== id))
  }, [])

  return { accesses, loading, addAccess, updateAccess, deleteAccess }
}
