import { motion } from 'framer-motion'
import { Sparkles, Clock, ChevronRight } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '../../../lib/utils'
import { itemVariants } from '../lib/animations'

interface AiSummary {
  situation: string
  action: string
  milestone: string
}

interface ProjectWithSummary {
  id: string
  name: string
  ai_summary: AiSummary | null
  ai_summary_generated_at: string | null
}

interface AiSummariesSectionProps {
  projects: ProjectWithSummary[]
  isMobile: boolean
  onNavigateToProject: (id: string) => void
}

const BLOCKS = [
  { key: 'situation' as const, label: 'Situation', color: 'text-blue-400' },
  { key: 'action' as const, label: 'En cours', color: 'text-amber-400' },
  { key: 'milestone' as const, label: 'Jalon', color: 'text-green-400' },
]

export function AiSummariesSection({ projects, isMobile, onNavigateToProject }: AiSummariesSectionProps) {
  const withSummary = projects.filter(p => p.ai_summary !== null)

  if (withSummary.length === 0) return null

  return (
    <motion.div
      variants={itemVariants}
      className="col-span-2 lg:col-span-12"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-white">Résumés IA — projets actifs</h2>
        <span className="text-xs text-muted-foreground">({withSummary.length})</span>
      </div>

      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"
      )}>
        {withSummary.map(project => (
          <button
            key={project.id}
            onClick={() => onNavigateToProject(project.id)}
            className="group text-left rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-semibold text-white truncate pr-2">{project.name}</span>
              <div className="flex items-center gap-1 shrink-0">
                {project.ai_summary_generated_at && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(parseISO(project.ai_summary_generated_at), { locale: fr, addSuffix: true })}
                  </span>
                )}
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="space-y-2">
              {BLOCKS.map(block => (
                <div key={block.key}>
                  <span className={cn('text-xs font-semibold uppercase tracking-wide', block.color)}>
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
    </motion.div>
  )
}
