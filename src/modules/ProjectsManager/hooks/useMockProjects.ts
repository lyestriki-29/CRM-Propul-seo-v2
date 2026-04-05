import { useState, useCallback } from 'react'
import type { ProjectV2, ProjectStatusV2 } from '../../../types/project-v2'
import { MOCK_PROJECTS } from '../mocks'

interface UseMockProjectsReturn {
  projects: ProjectV2[]
  loading: boolean
  updateProjectStatus: (id: string, newStatus: ProjectStatusV2) => void
  updateProject: (id: string, updates: Partial<ProjectV2>) => void
  addProject: (project: Omit<ProjectV2, 'id' | 'created_at' | 'updated_at'>) => ProjectV2
  deleteProject: (id: string) => void
  getProjectById: (id: string) => ProjectV2 | undefined
  refetch: () => void
}

export function useMockProjects(): UseMockProjectsReturn {
  const [projects, setProjects] = useState<ProjectV2[]>(MOCK_PROJECTS)

  const updateProjectStatus = useCallback((id: string, newStatus: ProjectStatusV2) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: newStatus, updated_at: new Date().toISOString() }
          : p
      )
    )
  }, [])

  const updateProject = useCallback((id: string, updates: Partial<ProjectV2>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updates, updated_at: new Date().toISOString() }
          : p
      )
    )
  }, [])

  const addProject = useCallback((data: Omit<ProjectV2, 'id' | 'created_at' | 'updated_at'>): ProjectV2 => {
    const newProject: ProjectV2 = {
      ...data,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setProjects(prev => [newProject, ...prev])
    return newProject
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  const getProjectById = useCallback((id: string) => {
    return projects.find(p => p.id === id)
  }, [projects])

  const refetch = useCallback(() => {
    // No-op en mode mock — état déjà en mémoire
  }, [])

  return {
    projects,
    loading: false,
    updateProjectStatus,
    updateProject,
    addProject,
    deleteProject,
    getProjectById,
    refetch,
  }
}
