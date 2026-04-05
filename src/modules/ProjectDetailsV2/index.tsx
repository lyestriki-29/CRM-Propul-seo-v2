import { useMockProjects } from '../ProjectsManagerV2/hooks/useMockProjects'
import { ProjectDetailsTabsV2 } from './components/ProjectDetailsTabsV2'
import { ProjectV2LeftSidebar } from './components/ProjectV2LeftSidebar'
import { ProjectV2RightSidebar } from './components/ProjectV2RightSidebar'

interface ProjectDetailsV2Props {
  projectId: string
  onBack: () => void
}

export function ProjectDetailsV2({ projectId, onBack }: ProjectDetailsV2Props) {
  const { getProjectById, refetch } = useMockProjects()
  const project = getProjectById(projectId)

  if (!project) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          ← Retour
        </button>
        <p className="text-muted-foreground">Projet introuvable.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#020205] overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 px-5 py-3 bg-[#070512] border-b border-[rgba(139,92,246,0.18)] shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-[#ede9fe] transition-colors"
        >
          ← Projets V2
        </button>
        <span className="text-[rgba(139,92,246,0.3)]">/</span>
        <span className="text-xs font-medium text-[#ede9fe] truncate">{project.name}</span>
      </div>

      {/* 3 colonnes */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar gauche */}
        <div className="w-[280px] shrink-0 border-r border-[rgba(139,92,246,0.18)] overflow-y-auto bg-[#070512]">
          <ProjectV2LeftSidebar project={project} />
        </div>

        {/* Contenu principal — onglets */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ProjectDetailsTabsV2 project={project} />
        </div>

        {/* Sidebar droite */}
        <div className="w-[300px] shrink-0 border-l border-[rgba(139,92,246,0.18)] overflow-y-auto bg-[#070512]">
          <ProjectV2RightSidebar project={project} onRefresh={refetch} />
        </div>
      </div>
    </div>
  )
}
