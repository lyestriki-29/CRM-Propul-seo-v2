import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Badge } from '../../../components/ui/badge'
import { SortableProjectCardV2 } from './SortableProjectCardV2'
import type { ProjectV2, ProjectStatusV2 } from '../../../types/project-v2'

interface ProjectColumnV2Props {
  id: ProjectStatusV2
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  textColor: string
  projects: ProjectV2[]
  onViewProject?: (project: ProjectV2) => void
  onEditProject?: (project: ProjectV2) => void
  onDeleteProject?: (project: ProjectV2) => void
}

export function ProjectColumnV2({ id, title, icon: Icon, color, textColor, projects, onViewProject, onEditProject, onDeleteProject }: ProjectColumnV2Props) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: 'column', columnId: id } })

  return (
    <div ref={setNodeRef}
      className={`flex flex-col rounded-lg border min-w-[240px] snap-start transition-all duration-200 ${color}
        ${isOver ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface-1 scale-[1.01]' : ''}`}>
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${textColor}`} />
          <h3 className={`text-sm font-semibold ${textColor}`}>{title}</h3>
        </div>
        <Badge variant="secondary" className="bg-white/10 text-foreground text-xs h-5 px-1.5">{projects.length}</Badge>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-240px)]">
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {projects.length === 0 ? (
            <div className={`flex items-center justify-center h-20 border-2 border-dashed rounded-lg transition-colors ${isOver ? 'border-primary bg-primary/10' : 'border-white/10'}`}>
              <p className="text-xs text-muted-foreground">{isOver ? 'Déposer ici' : 'Aucun projet'}</p>
            </div>
          ) : (
            projects.map(project => (
              <SortableProjectCardV2 key={project.id} project={project}
                onView={onViewProject} onEdit={onEditProject} onDelete={onDeleteProject} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}
