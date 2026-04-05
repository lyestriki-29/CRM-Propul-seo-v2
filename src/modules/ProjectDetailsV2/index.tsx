import { ArrowLeft } from 'lucide-react'
import { useMockProjects } from '../ProjectsManagerV2/hooks/useMockProjects'
import { ProjectStatusBadge } from '../ProjectsManagerV2/components/ProjectStatusBadge'
import { PrestaList } from '../ProjectsManagerV2/components/PrestaBadge'
import { ProjectDetailsTabsV2 } from './components/ProjectDetailsTabsV2'

interface ProjectDetailsV2Props {
  projectId: string
  onBack: () => void
}

export function ProjectDetailsV2({ projectId, onBack }: ProjectDetailsV2Props) {
  const { getProjectById } = useMockProjects()
  const project = getProjectById(projectId)

  if (!project) {
    return (
      <div className="p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />Retour
        </button>
        <p className="text-muted-foreground">Projet introuvable.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 min-h-screen">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4" />Projets V2
          </button>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-bold text-foreground truncate">{project.name}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ProjectStatusBadge status={project.status} />
          {project.presta_type.length > 0 && <PrestaList types={project.presta_type} size="sm" />}
        </div>
      </div>
      <ProjectDetailsTabsV2 project={project} />
    </div>
  )
}
