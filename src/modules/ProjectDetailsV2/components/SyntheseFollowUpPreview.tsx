import { Phone, Video, Mail, MessageSquare, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useFollowUpsV2 } from '../../ProjectsManagerV2/hooks/useFollowUpsV2'
import { MOCK_FOLLOW_UPS } from '../../ProjectsManagerV2/mocks/mockFollowUps'
import type { FollowUpType } from '../../../types/project-v2'

const TYPE_CONFIG: Record<FollowUpType, { label: string; icon: typeof Phone; color: string }> = {
  rdv:   { label: 'RDV',   icon: Video,         color: 'text-purple-400' },
  appel: { label: 'Appel', icon: Phone,         color: 'text-blue-400' },
  email: { label: 'Email', icon: Mail,          color: 'text-teal-400' },
  autre: { label: 'Autre', icon: MessageSquare, color: 'text-gray-400' },
}

interface Props {
  projectId: string
}

export function SyntheseFollowUpPreview({ projectId }: Props) {
  const { followUps, loading } = useFollowUpsV2(projectId)

  const displayFollowUps = followUps.length > 0
    ? followUps.slice(0, 5)
    : (MOCK_FOLLOW_UPS[projectId] ?? []).slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8B5CF6]" />
      </div>
    )
  }

  if (displayFollowUps.length === 0) {
    return (
      <p className="text-xs text-[#9ca3af] italic py-4">Aucun suivi enregistré.</p>
    )
  }

  return (
    <div className="space-y-3">
      {displayFollowUps.map(fu => {
        const config = TYPE_CONFIG[fu.type] ?? TYPE_CONFIG.autre
        const Icon = config.icon
        const hasPendingAction = fu.follow_up_action && !fu.follow_up_done

        return (
          <div key={fu.id} className="flex gap-3 group">
            <div className="shrink-0 mt-0.5">
              <Icon className={`h-3.5 w-3.5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#ede9fe] line-clamp-2 leading-relaxed">
                {fu.summary}
              </p>
              {hasPendingAction && (
                <div className="flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3 w-3 text-amber-400 shrink-0" />
                  <p className="text-[10px] text-amber-400 truncate">
                    {fu.follow_up_action}
                  </p>
                </div>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-[#9ca3af]">
                {format(parseISO(fu.date), 'd MMM', { locale: fr })}
              </p>
              {fu.assigned_name && (
                <p className="text-[10px] text-[#9ca3af] truncate max-w-[80px]">
                  {fu.assigned_name.split(' ')[0]}
                </p>
              )}
            </div>
          </div>
        )
      })}

      <p className="text-[10px] text-[#8B5CF6] hover:text-[#A78BFA] cursor-pointer pt-1">
        Voir tout dans Échanges
      </p>
    </div>
  )
}
