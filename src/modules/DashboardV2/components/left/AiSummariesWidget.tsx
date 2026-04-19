import { Sparkles, Clock, ChevronRight } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '../../../../lib/utils'
import { Skeleton } from '../../../../components/ui/skeleton'
import type { ProjectV2 } from '../../../../types/project-v2'

interface AiSummariesWidgetProps {
  projects: ProjectV2[]
  loading: boolean
  onNavigateToProject: (id: string) => void
}

const BLOCKS = [
  { key: 'situation' as const, label: 'Situation', color: 'text-blue-400' },
  { key: 'action' as const, label: 'En cours', color: 'text-amber-400' },
  { key: 'milestone' as const, label: 'Jalon', color: 'text-green-400' },
]

function scoreColor(score: number) {
  if (score >= 70) return 'bg-green-500/20 border-green-500/30'
  if (score >= 40) return 'bg-amber-500/20 border-amber-500/30'
  return 'bg-red-500/20 border-red-500/30'
}

function scoreTextColor(score: number) {
  if (score >= 70) return 'text-green-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

export function AiSummariesWidget({ projects, loading, onNavigateToProject }: AiSummariesWidgetProps) {
  const withSummary = projects.filter(p => p.ai_summary !== null)

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-white">Résumés IA</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (withSummary.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-white">Résumés IA — projets actifs</h2>
        <span className="text-xs text-muted-foreground">({withSummary.length})</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {withSummary.map(project => (
          <button
            key={project.id}
            onClick={() => onNavigateToProject(project.id)}
            className="group text-left rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-semibold text-white truncate pr-2">{project.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full border',
                  scoreColor(project.completion_score),
                  scoreTextColor(project.completion_score)
                )}>
                  {project.completion_score}%
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {project.ai_summary_generated_at && (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2">
                <Clock className="h-2.5 w-2.5" />
                {formatDistanceToNow(parseISO(project.ai_summary_generated_at), { locale: fr, addSuffix: true })}
              </p>
            )}

            <div className="space-y-1.5">
              {BLOCKS.map(block => (
                <div key={block.key}>
                  <span className={cn('text-[10px] font-semibold uppercase tracking-wide', block.color)}>
                    {block.label}
                  </span>
                  <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2 mt-0.5">
                    {project.ai_summary?.[block.key]}
                  </p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
