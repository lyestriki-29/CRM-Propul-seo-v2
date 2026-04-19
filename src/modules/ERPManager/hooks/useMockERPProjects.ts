import { useState, useEffect, useCallback } from 'react'
import { v2 } from '../../../lib/supabase'
import { MOCK_ERP_PROJECTS } from '../mocks'
import type { ProjectV2 } from '../../../types/project-v2'
import type { StatusERP } from '../../../types/project-v2'

type ERPProject = ProjectV2 & { erp_status: StatusERP }

export function useMockERPProjects() {
  const [projects, setProjects] = useState<ERPProject[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey(k => k + 1), [])

  // Charger depuis Supabase, fallback mocks
  useEffect(() => {
    setLoading(true)
    v2
      .from('projects')
      .select('*')
      .eq('is_archived', false)
      .in('category', ['erp', 'erp_v2'])
      .order('last_activity_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProjects(data.map((p: ProjectV2) => ({
            ...p,
            erp_status: (p.status as StatusERP) || 'prospect',
          })))
        } else {
          // Fallback mocks si DB vide
          setProjects(MOCK_ERP_PROJECTS)
        }
        setLoading(false)
      })
  }, [refreshKey])

  const updateStatus = useCallback(async (id: string, status: StatusERP) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, erp_status: status, status } : p))
    await v2.from('projects').update({ status }).eq('id', id)
  }, [])

  const addProject = useCallback(async (data: Omit<ERPProject, 'id' | 'created_at' | 'updated_at'>) => {
    const { erp_status, ...projectData } = data
    const payload = { ...projectData, status: erp_status || data.status || 'prospect' }
    const { data: created, error } = await v2
      .from('projects')
      .insert(payload)
      .select()
      .single()
    if (!error && created) {
      const p = created as ProjectV2
      setProjects(prev => [...prev, { ...p, erp_status: (p.status as StatusERP) || 'prospect' }])
      return p.id
    }
    // Fallback local si erreur Supabase
    const id = `erp-${Date.now()}`
    const now = new Date().toISOString()
    setProjects(prev => [...prev, { ...data, id, created_at: now, updated_at: now }])
    return id
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    await v2.from('projects').delete().eq('id', id)
  }, [])

  return { projects, loading, updateStatus, addProject, deleteProject, refetch }
}
