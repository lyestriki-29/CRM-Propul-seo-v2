import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ProjectV2 } from '../../../types/project-v2'
import { ProjectStatusBadge } from '../../ProjectsManagerV2/components/ProjectStatusBadge'

interface ProjectListProps {
  title: string
  projects: ProjectV2[]
  emptyLabel: string
  onSelect: (project: ProjectV2) => void
}

export function ProjectList({ title, projects, emptyLabel, onSelect }: ProjectListProps) {
  return (
    <div className="bg-surface-2 rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          {title}
          <span className="ml-2 text-xs text-muted-foreground font-normal">({projects.length})</span>
        </h3>
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground px-4 py-6 text-center">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-border">
          {projects.map(p => (
            <li
              key={p.id}
              className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface-1 cursor-pointer transition-colors"
              onClick={() => onSelect(p)}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                {p.client_name && (
                  <p className="text-xs text-muted-foreground truncate">{p.client_name}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ProjectStatusBadge status={p.status} />
                {p.end_date && (
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(p.end_date), 'd MMM', { locale: fr })}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
