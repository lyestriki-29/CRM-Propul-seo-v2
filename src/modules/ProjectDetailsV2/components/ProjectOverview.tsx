import { useState } from 'react'
import { Euro, TrendingUp, CheckSquare, Calendar, Phone, Mail, Clipboard, FileText, Users, Plus, X } from 'lucide-react'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DeadlineBadge } from '../../ProjectsManagerV2/components/DeadlineBadge'
import { useActivitiesV2 } from '../../ProjectsManagerV2/hooks/useActivitiesV2'
import { cn } from '../../../lib/utils'
import { toast } from 'sonner'
import type { ProjectV2 } from '../../../types/project-v2'
import type { ActivityType } from '../../../types/project-v2'

interface ProjectOverviewProps {
  project: ProjectV2
  onRefresh: () => void
}

function MetricCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  sub?: React.ReactNode
}) {
  return (
    <div className="bg-[#0f0b1e] rounded-lg p-3 border border-[rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5 text-[#9ca3af]" />
        <span className="text-xs text-[#9ca3af]">{label}</span>
      </div>
      <p className="text-lg font-bold text-[#ede9fe]">{value}</p>
      {sub && <p className="text-xs text-[#9ca3af] mt-0.5">{sub}</p>}
    </div>
  )
}

const QUICK_ACTIONS: { type: ActivityType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { type: 'call',    label: 'Appel',   icon: Phone,     color: 'text-green-400 border-green-500/30 hover:bg-green-500/10' },
  { type: 'email',   label: 'Email',   icon: Mail,      color: 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10' },
  { type: 'task',    label: 'Tâche',   icon: Clipboard, color: 'text-teal-400 border-teal-500/30 hover:bg-teal-500/10' },
  { type: 'meeting', label: 'RDV',     icon: Users,     color: 'text-violet-400 border-violet-500/30 hover:bg-violet-500/10' },
  { type: 'decision',label: 'Note',   icon: FileText,  color: 'text-purple-400 border-purple-500/30 hover:bg-purple-500/10' },
]

const TYPE_CONFIG: Record<ActivityType, { label: string; dot: string; badge: string }> = {
  email:    { label: 'Email',    dot: 'bg-blue-500',    badge: 'bg-blue-500/20 text-blue-300' },
  call:     { label: 'Appel',   dot: 'bg-green-500',   badge: 'bg-green-500/20 text-green-300' },
  meeting:  { label: 'RDV',     dot: 'bg-violet-500',  badge: 'bg-violet-500/20 text-violet-300' },
  decision: { label: 'Note',    dot: 'bg-purple-500',  badge: 'bg-purple-500/20 text-purple-300' },
  task:     { label: 'Tâche',   dot: 'bg-teal-500',    badge: 'bg-teal-500/20 text-teal-300' },
  file:     { label: 'Fichier', dot: 'bg-orange-500',  badge: 'bg-orange-500/20 text-orange-300' },
  access:   { label: 'Accès',   dot: 'bg-yellow-500',  badge: 'bg-yellow-500/20 text-yellow-300' },
  status:   { label: 'Statut',  dot: 'bg-indigo-500',  badge: 'bg-indigo-500/20 text-indigo-300' },
  invoice:  { label: 'Facture', dot: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300' },
  system:   { label: 'Système', dot: 'bg-gray-500',    badge: 'bg-gray-500/20 text-gray-400' },
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const formatDate = (d: string | null) =>
    d ? format(parseISO(d), 'd MMM yyyy', { locale: fr }) : '—'

  const { activities, loading, addActivity } = useActivitiesV2(project.id)

  const [activeType, setActiveType] = useState<ActivityType | null>(null)
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')

  const handleQuickAction = (type: ActivityType) => {
    setActiveType(prev => prev === type ? null : type)
    setContent('')
  }

  const handleSubmit = async () => {
    if (!activeType || !content.trim()) return
    try {
      await addActivity({ type: activeType, content: content.trim(), author_name: authorName.trim() || undefined })
      toast.success('Activité enregistrée')
      setActiveType(null)
      setContent('')
      setAuthorName('')
    } catch {
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  const recent = activities.slice(0, 8)

  return (
    <div className="space-y-5">
      {/* Métriques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={Euro}
          label="Budget"
          value={project.budget ? `${project.budget.toLocaleString('fr-FR')} €` : '—'}
          sub="Budget total"
        />
        <MetricCard
          icon={TrendingUp}
          label="Progression"
          value={`${project.progress}%`}
          sub="Avancement général"
        />
        <MetricCard
          icon={CheckSquare}
          label="Score"
          value={`${project.completion_score}%`}
          sub="Complétude projet"
        />
        <MetricCard
          icon={Calendar}
          label="Échéance"
          value={formatDate(project.end_date)}
          sub={project.end_date ? <DeadlineBadge endDate={project.end_date} /> : '—'}
        />
      </div>

      {/* Tracker d'activités */}
      <div className="border border-[rgba(139,92,246,0.15)] rounded-xl overflow-hidden bg-[#070512]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[rgba(139,92,246,0.12)] flex items-center justify-between">
          <p className="text-xs font-semibold text-[#ede9fe]">Activités</p>
          {loading && <span className="text-[10px] text-[#9ca3af]">Chargement…</span>}
        </div>

        {/* Quick actions */}
        <div className="px-4 py-3 border-b border-[rgba(139,92,246,0.12)]">
          <div className="flex gap-2 flex-wrap">
            {QUICK_ACTIONS.map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                onClick={() => handleQuickAction(type)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                  color,
                  activeType === type
                    ? 'opacity-100 ring-1 ring-[rgba(139,92,246,0.4)]'
                    : 'opacity-80 hover:opacity-100'
                )}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Formulaire inline */}
          {activeType && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', TYPE_CONFIG[activeType].badge)}>
                  {TYPE_CONFIG[activeType].label}
                </span>
                <button
                  onClick={() => setActiveType(null)}
                  className="ml-auto text-[#9ca3af] hover:text-[#ede9fe]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Détails de l'${TYPE_CONFIG[activeType].label.toLowerCase()}…`}
                className="w-full bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.2)] rounded-lg px-3 py-2 text-xs text-[#ede9fe] placeholder:text-[#6b7280] resize-none focus:outline-none focus:border-[rgba(139,92,246,0.5)] min-h-[72px]"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <input
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="Votre nom (optionnel)"
                  className="flex-1 bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.2)] rounded-lg px-3 py-1.5 text-xs text-[#ede9fe] placeholder:text-[#6b7280] focus:outline-none focus:border-[rgba(139,92,246,0.5)]"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        {!loading && recent.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-[#9ca3af] italic">Aucune activité enregistrée</p>
          </div>
        )}

        {recent.length > 0 && (
          <div className="divide-y divide-[rgba(139,92,246,0.08)]">
            {recent.map(activity => {
              const cfg = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.system
              return (
                <div key={activity.id} className="px-4 py-3 flex gap-3 group hover:bg-[rgba(139,92,246,0.04)] transition-colors">
                  {/* Dot */}
                  <div className="flex flex-col items-center pt-1 shrink-0">
                    <div className={cn('h-2 w-2 rounded-full shrink-0', cfg.dot)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0', cfg.badge)}>
                        {cfg.label}
                      </span>
                      {activity.author_name && (
                        <span className="text-[10px] text-[#9ca3af] truncate">{activity.author_name}</span>
                      )}
                      <span className="text-[10px] text-[#6b7280] ml-auto shrink-0">
                        {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    <p className="text-xs text-[#9ca3af] leading-relaxed line-clamp-2">{activity.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activities.length > 8 && (
          <div className="px-4 py-2 border-t border-[rgba(139,92,246,0.12)] text-center">
            <p className="text-[10px] text-[#9ca3af]">+{activities.length - 8} activités — voir l'onglet Historique</p>
          </div>
        )}
      </div>
    </div>
  )
}
