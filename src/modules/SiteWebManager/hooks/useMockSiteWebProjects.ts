import { useState, useCallback } from 'react'
import { MOCK_SITEWEB_PROJECTS } from '../mocks'
import type { ProjectV2 } from '../../../types/project-v2'
import type { StatusSiteWeb } from '../../../types/project-v2'

type SiteWebProject = ProjectV2 & { sw_status: StatusSiteWeb }

export function useMockSiteWebProjects() {
  const [projects, setProjects] = useState<SiteWebProject[]>(MOCK_SITEWEB_PROJECTS)

  const updateStatus = useCallback((id: string, status: StatusSiteWeb) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, sw_status: status } : p))
  }, [])

  const addProject = useCallback((data: Omit<SiteWebProject, 'id' | 'created_at' | 'updated_at'>) => {
    const id = `sw-${Date.now()}`
    const now = new Date().toISOString()
    setProjects(prev => [...prev, { ...data, id, created_at: now, updated_at: now }])
    return id
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  return { projects, updateStatus, addProject, deleteProject }
}
