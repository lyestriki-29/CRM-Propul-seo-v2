import { Badge } from '@/components/ui/badge'
import type { ProjectStatusV2 } from '../../../types/project-v2'

const STATUS_CONFIG: Record<ProjectStatusV2, { label: string; className: string }> = {
  prospect:       { label: 'Prospect',      className: 'bg-slate-500/20 text-slate-300 border-slate-600' },
  brief_received: { label: 'Brief reçu',    className: 'bg-blue-500/20 text-blue-300 border-blue-600' },
  quote_sent:     { label: 'Devis envoyé',  className: 'bg-indigo-500/20 text-indigo-300 border-indigo-600' },
  in_progress:    { label: 'En cours',      className: 'bg-green-500/20 text-green-300 border-green-600' },
  review:         { label: 'Recette',       className: 'bg-orange-500/20 text-orange-300 border-orange-600' },
  delivered:      { label: 'Livré',         className: 'bg-teal-500/20 text-teal-300 border-teal-600' },
  maintenance:    { label: 'Maintenance',   className: 'bg-purple-500/20 text-purple-300 border-purple-600' },
  on_hold:        { label: 'En pause',      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-600' },
  closed:         { label: 'Clôturé',       className: 'bg-gray-500/20 text-gray-400 border-gray-600' },
}

interface ProjectStatusBadgeProps {
  status: ProjectStatusV2
  size?: 'sm' | 'md'
}

export function ProjectStatusBadge({ status, size = 'md' }: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge
      variant="outline"
      className={`${config.className} border ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'}`}
    >
      {config.label}
    </Badge>
  )
}
