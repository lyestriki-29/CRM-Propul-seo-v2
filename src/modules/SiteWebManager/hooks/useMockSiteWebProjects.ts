import { useState, useEffect, useCallback } from 'react'
import { v2 } from '../../../lib/supabase'
import { MOCK_SITEWEB_PROJECTS } from '../mocks'
import type { ProjectV2 } from '../../../types/project-v2'
import type { StatusSiteWeb } from '../../../types/project-v2'

type SiteWebProject = ProjectV2 & { sw_status: StatusSiteWeb }

export function useMockSiteWebProjects() {
  const [projects, setProjects] = useState<SiteWebProject[]>([])
  const [loading, setLoading] = useState(true)

  // Charger depuis Supabase, fallback mocks
  useEffect(() => {
    setLoading(true)
    v2
      .from('projects')
      .select('*')
      .eq('is_archived', false)
      .in('category', ['site_web', 'web'])
      .order('last_activity_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProjects(data.map((p: ProjectV2) => ({
            ...p,
            sw_status: (p.status as StatusSiteWeb) || 'prospect',
          })))
        } else {
          // Fallback mocks si DB vide
          setProjects(MOCK_SITEWEB_PROJECTS)
        }
        setLoading(false)
      })
  }, [])

  const updateStatus = useCallback(async (id: string, status: StatusSiteWeb) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, sw_status: status, status } : p))
    await v2.from('projects').update({ status }).eq('id', id)
  }, [])

  const addProject = useCallback(async (data: Omit<SiteWebProject, 'id' | 'created_at' | 'updated_at'>) => {
    const { sw_status, ...projectData } = data
    const payload = { ...projectData, status: sw_status || data.status || 'prospect' }
    const { data: created, error } = await v2
      .from('projects')
      .insert(payload)
      .select()
      .single()
    if (!error && created) {
      const p = created as ProjectV2
      setProjects(prev => [...prev, { ...p, sw_status: (p.status as StatusSiteWeb) || 'prospect' }])
      return p.id
    }
    // Fallback local si erreur Supabase
    const id = `sw-${Date.now()}`
    const now = new Date().toISOString()
    setProjects(prev => [...prev, { ...data, id, created_at: now, updated_at: now }])
    return id
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    await v2.from('projects').delete().eq('id', id)
  }, [])

  return { projects, loading, updateStatus, addProject, deleteProject }
}
