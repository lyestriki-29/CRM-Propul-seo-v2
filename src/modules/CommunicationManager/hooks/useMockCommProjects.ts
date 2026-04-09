import { useState, useCallback } from 'react'
import { MOCK_COMM_PROJECTS } from '../mocks'
import type { ProjectV2, StatusComm } from '../../../types/project-v2'

type CommProject = ProjectV2 & { comm_status: StatusComm }

export function useMockCommProjects() {
  const [projects, setProjects] = useState<CommProject[]>(MOCK_COMM_PROJECTS)

  const updateStatus = useCallback((id: string, status: StatusComm) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, comm_status: status } : p))
  }, [])

  const addProject = useCallback((data: Omit<CommProject, 'id' | 'created_at' | 'updated_at'>) => {
    const id = `comm-${Date.now()}`
    const now = new Date().toISOString()
    setProjects(prev => [...prev, { ...data, id, created_at: now, updated_at: now }])
    return id
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  return { projects, updateStatus, addProject, deleteProject }
}
