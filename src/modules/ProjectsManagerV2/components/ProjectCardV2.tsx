import { memo } from 'react'
import { GripVertical, Euro, User, Eye, Edit, Trash2 } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ProjectV2 } from '../../../types/project-v2'
import { DeadlineBadge } from './DeadlineBadge'
import { PrestaList } from './PrestaBadge'
import { CompletionScore } from './CompletionScore'

interface ProjectCardV2Props {
  project: ProjectV2
  isDragging?: boolean
  onView?: (project: ProjectV2) => void
  onEdit?: (project: ProjectV2) => void
  onDelete?: (project: ProjectV2) => void
}

export const ProjectCardV2 = memo(function ProjectCardV2({
  project, isDragging = false, onView, onEdit, onDelete,
}: ProjectCardV2Props) {
  const lastActivity = project.last_activity_at
    ? formatDistanceToNow(parseISO(project.last_activity_at), { addSuffix: true, locale: fr })
    : null

  return (
    <div className={`bg-surface-2 border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 group
      ${isDragging ? 'shadow-xl rotate-2 scale-105 opacity-90 ring-1 ring-primary/50' : 'hover:border-border/80 hover:shadow-md'}`}>

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
          {project.presta_type.length > 0 && <PrestaList types={project.presta_type} size="sm" />}
        </div>
        <CompletionScore score={project.completion_score} size={32} />
      </div>

      <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2 mb-0.5">{project.name}</p>
      {project.client_name && <p className="text-xs text-muted-foreground mb-2 truncate">{project.client_name}</p>}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
        {project.budget !== null && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Euro className="h-3 w-3" />{project.budget.toLocaleString('fr-FR')}
          </span>
        )}
        {project.assigned_name && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground truncate max-w-[100px]">
            <User className="h-3 w-3 shrink-0" />{project.assigned_name}
          </span>
        )}
        {project.end_date && <DeadlineBadge endDate={project.end_date} />}
      </div>

      {lastActivity && <p className="text-[10px] text-muted-foreground/60 mb-2 truncate">Activité {lastActivity}</p>}

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onView && (
          <button onClick={(e) => { e.stopPropagation(); onView(project) }}
            className="flex-1 flex items-center justify-center gap-1 text-xs py-1 rounded bg-surface-3 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors">
            <Eye className="h-3 w-3" />Voir
          </button>
        )}
        {onEdit && (
          <button onClick={(e) => { e.stopPropagation(); onEdit(project) }}
            className="flex items-center justify-center p-1 rounded bg-surface-3 hover:bg-blue-500/20 hover:text-blue-300 text-muted-foreground transition-colors">
            <Edit className="h-3 w-3" />
          </button>
        )}
        {onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(project) }}
            className="flex items-center justify-center p-1 rounded bg-surface-3 hover:bg-red-500/20 hover:text-red-300 text-muted-foreground transition-colors">
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
})
