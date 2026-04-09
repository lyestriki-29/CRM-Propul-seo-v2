import { useState, useCallback } from 'react'
import { MOCK_ERP_PROJECTS } from '../mocks'
import type { ProjectV2 } from '../../../types/project-v2'
import type { StatusERP } from '../../../types/project-v2'

type ERPProject = ProjectV2 & { erp_status: StatusERP }

export function useMockERPProjects() {
  const [projects, setProjects] = useState<ERPProject[]>(MOCK_ERP_PROJECTS)

  const updateStatus = useCallback((id: string, status: StatusERP) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, erp_status: status } : p))
  }, [])

  const addProject = useCallback((data: Omit<ERPProject, 'id' | 'created_at' | 'updated_at'>) => {
    const id = `erp-${Date.now()}`
    const now = new Date().toISOString()
    setProjects(prev => [...prev, { ...data, id, created_at: now, updated_at: now }])
    return id
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  return { projects, updateStatus, addProject, deleteProject }
}
