import { createContext, useContext, type ReactNode } from 'react'
import type { ProjectV2, ProjectStatusV2 } from '../../../types/project-v2'
import { useProjectsV2 } from '../hooks/useProjectsV2'

interface ProjectsV2ContextValue {
  projects: ProjectV2[]
  loading: boolean
  updateProjectStatus: (id: string, newStatus: ProjectStatusV2) => Promise<void>
  updateProject: (id: string, updates: Partial<ProjectV2>) => Promise<void>
  addProject: (project: Omit<ProjectV2, 'id' | 'created_at' | 'updated_at'>) => Promise<ProjectV2 | null>
  deleteProject: (id: string) => Promise<void>
  getProjectById: (id: string) => ProjectV2 | undefined
  refetch: () => void
}

const ProjectsV2Context = createContext<ProjectsV2ContextValue | null>(null)

export function ProjectsV2Provider({ children }: { children: ReactNode }) {
  const value = useProjectsV2()

  return (
    <ProjectsV2Context.Provider value={value}>
      {children}
    </ProjectsV2Context.Provider>
  )
}

export function useProjectsV2Context(): ProjectsV2ContextValue {
  const ctx = useContext(ProjectsV2Context)
  if (!ctx) throw new Error('useProjectsV2Context doit être utilisé dans <ProjectsV2Provider>')
  return ctx
}
