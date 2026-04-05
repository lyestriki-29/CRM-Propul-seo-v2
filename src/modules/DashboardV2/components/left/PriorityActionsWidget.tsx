import { AlertTriangle, Briefcase, CheckCircle, FileText, ChevronRight, Mail, CheckCheck } from 'lucide-react'
import { Badge } from '../../../../components/ui/badge'
import { Skeleton } from '../../../../components/ui/skeleton'
import { cn } from '../../../../lib/utils'
import type { PriorityActionItem } from '../../hooks/useDashboardData'

interface PriorityActionsWidgetProps {
  items: PriorityActionItem[]
  loading: boolean
  onNavigateToProject: (id: string) => void
  onNavigateToLead: (id: string) => void
  onMarkEmailReplied?: (activityId: string) => void
}

const SEVERITY_STYLES = {
  red:    { bar: 'bg-red-500',    badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  orange: { bar: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  yellow: { bar: 'bg-yellow-500', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
}

const TYPE_CONFIG = {
  projet: { label: 'Projet',  icon: Briefcase },
  tache:  { label: 'Tâche',   icon: CheckCircle },
  devis:  { label: 'Devis',   icon: FileText },
  email:  { label: 'Email',   icon: Mail },
}

export function PriorityActionsWidget({
  items,
  loading,
  onNavigateToProject,
  onNavigateToLead,
  onMarkEmailReplied,
}: PriorityActionsWidgetProps) {
  if (loading) return <Skeleton className="h-48 rounded-2xl" />

  const handleNavigate = (item: PriorityActionItem) => {
    if (item.projectId) onNavigateToProject(item.projectId)
    else if (item.leadId) onNavigateToLead(item.leadId)
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Actions prioritaires</h3>
        <span className="ml-auto text-xs text-muted-foreground">{items.length} item(s)</span>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">Aucune action urgente — beau travail !</p>
      )}

      <div className="space-y-2">
        {items.map(item => {
          const styles    = SEVERITY_STYLES[item.severity]
          const typeConf  = TYPE_CONFIG[item.type]
          const TypeIcon  = typeConf.icon
          const isEmail   = item.type === 'email'
          const canNavigate = !!(item.projectId || item.leadId)

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl bg-surface-1/50 border border-border/30',
                'relative overflow-hidden'
              )}
            >
              {/* Barre de sévérité */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', styles.bar)} />

              <div className={cn('p-1.5 rounded-lg border shrink-0', styles.badge)}>
                <TypeIcon className="h-3.5 w-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{item.label}</p>
                {item.subLabel && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.subLabel}</p>
                )}
              </div>

              <Badge variant="outline" className={cn('text-[10px] shrink-0 border', styles.badge)}>
                {typeConf.label}
              </Badge>

              {/* Email : bouton "Marquer répondu" */}
              {isEmail && item.activityId && onMarkEmailReplied && (
                <button
                  onClick={() => onMarkEmailReplied(item.activityId!)}
                  className="shrink-0 p-1 rounded-lg hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-colors"
                  aria-label="Marquer comme répondu"
                  title="Marquer comme répondu"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Autres types : bouton navigation */}
              {!isEmail && canNavigate && (
                <button
                  onClick={() => handleNavigate(item)}
                  className="shrink-0 p-1 rounded-lg hover:bg-surface-1 transition-colors"
                  aria-label={`Aller à ${item.label}`}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}

              {/* Email avec projet : bouton navigation également */}
              {isEmail && canNavigate && (
                <button
                  onClick={() => handleNavigate(item)}
                  className="shrink-0 p-1 rounded-lg hover:bg-surface-1 transition-colors"
                  aria-label={`Ouvrir le projet`}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
