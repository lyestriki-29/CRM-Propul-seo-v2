// src/modules/ProjectDetailsV2/components/ProjectV2LeftSidebar.tsx
import { Building2, User, Euro, Calendar, Tag, Zap } from 'lucide-react'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { ProjectStatusBadge } from '../../ProjectsManagerV2/components/ProjectStatusBadge'
import { PrestaList } from '../../ProjectsManagerV2/components/PrestaBadge'
import { CompletionScore } from '../../ProjectsManagerV2/components/CompletionScore'
import type { ProjectV2 } from '../../../types/project-v2'

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  low:    { label: 'Faible',  color: 'text-slate-400' },
  medium: { label: 'Moyenne', color: 'text-blue-400' },
  high:   { label: 'Haute',   color: 'text-amber-400' },
  urgent: { label: 'Urgente', color: 'text-red-400' },
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[rgba(139,92,246,0.15)] py-4 px-4">
      <p className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  )
}

function InfoRow({
  icon: Icon, label, value, colorClass,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  colorClass?: string
}) {
  return (
    <div className="flex items-start gap-2.5 mb-3 last:mb-0">
      <Icon className="h-3.5 w-3.5 text-[#9ca3af] shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-[#9ca3af]">{label}</p>
        <p className={cn('text-xs font-medium mt-0.5', colorClass ?? 'text-[#ede9fe]')}>{value}</p>
      </div>
    </div>
  )
}

const fmt = (d: string | null) =>
  d ? format(parseISO(d), 'd MMM yyyy', { locale: fr }) : '—'

export function ProjectV2LeftSidebar({ project }: { project: ProjectV2 }) {
  const priority = PRIORITY_LABELS[project.priority] ?? PRIORITY_LABELS.medium

  return (
    <div className="flex flex-col">
      {/* En-tête identité */}
      <div className="px-4 pt-5 pb-4 border-b border-[rgba(139,92,246,0.15)]">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.2)] flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-[#8B5CF6]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-[#ede9fe] leading-tight truncate">{project.name}</h2>
            {project.client_name && (
              <p className="text-xs text-[#9ca3af] mt-0.5 truncate">{project.client_name}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <ProjectStatusBadge status={project.status} />
          {(project.presta_type?.length ?? 0) > 0 && <PrestaList types={project.presta_type} size="sm" />}
        </div>

        {project.description && (
          <p className="text-[11px] text-[#9ca3af] leading-relaxed">{project.description}</p>
        )}
      </div>

      {/* Score de complétude */}
      <div className="px-4 py-4 border-b border-[rgba(139,92,246,0.15)] flex items-center gap-4">
        <CompletionScore score={project.completion_score} size={52} showLabel />
        <div className="flex-1">
          <p className="text-[10px] text-[#9ca3af] mb-1.5">Progression générale</p>
          <div className="h-1.5 rounded-full bg-[rgba(139,92,246,0.15)]">
            <div
              className="h-1.5 rounded-full bg-[#8B5CF6] transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-[10px] text-[#9ca3af] mt-1">{project.progress}% avancement</p>
        </div>
      </div>

      {/* Équipe & priorité */}
      <SidebarSection title="Équipe">
        <InfoRow
          icon={User}
          label="Responsable"
          value={project.assigned_name ?? <span className="italic text-[#9ca3af]">Non assigné</span>}
        />
        <InfoRow
          icon={Tag}
          label="Priorité"
          value={priority.label}
          colorClass={priority.color}
        />
        {project.budget && (
          <InfoRow
            icon={Euro}
            label="Budget"
            value={`${project.budget.toLocaleString('fr-FR')} €`}
          />
        )}
      </SidebarSection>

      {/* Dates */}
      <SidebarSection title="Dates">
        <InfoRow icon={Calendar} label="Début" value={fmt(project.start_date)} />
        <InfoRow icon={Calendar} label="Fin prévue" value={fmt(project.end_date)} />
        {project.last_activity_at && (
          <InfoRow
            icon={Zap}
            label="Dernière activité"
            value={formatDistanceToNow(parseISO(project.last_activity_at), { addSuffix: true, locale: fr })}
          />
        )}
      </SidebarSection>

      {/* Prochaine action (résumé) */}
      {project.next_action_label && (
        <SidebarSection title="Prochaine action">
          <p className="text-xs text-[#ede9fe] font-medium">{project.next_action_label}</p>
          {project.next_action_due && (
            <p className="text-[10px] text-[#9ca3af] mt-1">
              {format(parseISO(project.next_action_due), 'd MMM yyyy', { locale: fr })}
            </p>
          )}
        </SidebarSection>
      )}
    </div>
  )
}
