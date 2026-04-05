import { Clock, Zap } from 'lucide-react'
import { MOCK_ACTIVITIES } from '../../ProjectsManager/mocks'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ActivityType } from '../../../types/project-v2'

const TYPE_CONFIG: Record<ActivityType, { label: string; color: string }> = {
  email:    { label: 'Email',     color: 'bg-blue-500/20 text-blue-300' },
  call:     { label: 'Appel',     color: 'bg-green-500/20 text-green-300' },
  decision: { label: 'Décision',  color: 'bg-purple-500/20 text-purple-300' },
  task:     { label: 'Tâche',     color: 'bg-teal-500/20 text-teal-300' },
  file:     { label: 'Fichier',   color: 'bg-orange-500/20 text-orange-300' },
  access:   { label: 'Accès',     color: 'bg-yellow-500/20 text-yellow-300' },
  status:   { label: 'Statut',    color: 'bg-indigo-500/20 text-indigo-300' },
  invoice:  { label: 'Facture',   color: 'bg-emerald-500/20 text-emerald-300' },
  system:   { label: 'Système',   color: 'bg-gray-500/20 text-gray-400' },
}

interface ProjectTimelineProps {
  projectId: string
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const activities = (MOCK_ACTIVITIES[projectId] ?? []).slice().reverse()

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <Clock className="h-10 w-10 opacity-30" />
        <p className="text-sm">Aucune activité pour ce projet.</p>
        <p className="text-xs opacity-60">Le journal se remplit automatiquement au fil des actions.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Journal d'activité</h3>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Zap className="h-3 w-3" />
          Temps réel — Sprint 2
        </span>
      </div>

      <div className="relative">
        {/* Ligne verticale */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {activities.map(activity => {
            const conf = TYPE_CONFIG[activity.type]
            return (
              <div key={activity.id} className="relative flex gap-4 pl-10 py-3 group">
                {/* Dot */}
                <div className={`absolute left-2.5 top-4 h-3 w-3 rounded-full border-2 border-surface-1 ${conf.color.split(' ')[0]}`} />

                {/* Contenu */}
                <div className="flex-1 min-w-0 bg-surface-2 border border-border rounded-lg p-3 group-hover:border-border/80 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${conf.color}`}>
                        {conf.label}
                      </span>
                      {activity.is_auto && (
                        <span className="text-[10px] text-muted-foreground/60">auto</span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{activity.content}</p>
                  {activity.author_name && (
                    <p className="text-xs text-muted-foreground mt-1">{activity.author_name}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
