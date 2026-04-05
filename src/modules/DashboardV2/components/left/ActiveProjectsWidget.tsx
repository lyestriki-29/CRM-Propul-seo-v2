// src/modules/DashboardV2/components/left/ActiveProjectsWidget.tsx
import { Briefcase, ChevronRight, ArrowRight } from 'lucide-react'
import { Skeleton } from '../../../../components/ui/skeleton'
import { cn } from '../../../../lib/utils'
import type { ProjectV2, ProjectStatusV2 } from '../../../../types/project-v2'

interface ActiveProjectsWidgetProps {
  projects: ProjectV2[]
  loading: boolean
  onNavigateToProject: (id: string) => void
  onNavigateToAllProjects: () => void
}

const STATUS_CONFIG: Record<ProjectStatusV2, { label: string; color: string }> = {
  prospect:      { label: 'Prospect',    color: 'bg-slate-500/20 text-slate-400 border-slate-500/20' },
  brief_received:{ label: 'Brief reçu',  color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
  quote_sent:    { label: 'Devis envoyé',color: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
  in_progress:   { label: 'En cours',    color: 'bg-green-500/20 text-green-400 border-green-500/20' },
  review:        { label: 'Révision',    color: 'bg-violet-500/20 text-violet-400 border-violet-500/20' },
  delivered:     { label: 'Livré',       color: 'bg-teal-500/20 text-teal-400 border-teal-500/20' },
  maintenance:   { label: 'Maintenance', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20' },
  on_hold:       { label: 'En pause',    color: 'bg-orange-500/20 text-orange-400 border-orange-500/20' },
  closed:        { label: 'Clôturé',     color: 'bg-gray-500/20 text-gray-400 border-gray-500/20' },
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1 rounded-full bg-border/30">
        <div
          className={cn('h-1 rounded-full transition-all', color)}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">{score}%</span>
    </div>
  )
}

export function ActiveProjectsWidget({
  projects,
  loading,
  onNavigateToProject,
  onNavigateToAllProjects,
}: ActiveProjectsWidgetProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Briefcase className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Projets en cours</h3>
        <span className="ml-auto text-xs text-muted-foreground">{projects.length}</span>
      </div>

      {projects.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">Aucun projet actif</p>
      )}

      <div className="space-y-2">
        {projects.map(project => {
          const statusConf = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.in_progress

          return (
            <button
              key={project.id}
              onClick={() => onNavigateToProject(project.id)}
              className="w-full text-left p-3 rounded-xl bg-surface-1/50 border border-border/30 hover:border-border hover:bg-surface-1/80 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{project.name}</p>
                  {project.client_name && (
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{project.client_name}</p>
                  )}
                  <ScoreBar score={project.completion_score} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full border font-medium',
                    statusConf.color
                  )}>
                    {statusConf.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {projects.length > 0 && (
        <button
          onClick={onNavigateToAllProjects}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors py-1.5"
        >
          Voir tous les projets
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
