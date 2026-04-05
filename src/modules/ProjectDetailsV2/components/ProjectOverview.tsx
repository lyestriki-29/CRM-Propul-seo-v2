import { useState } from 'react'
import {
  Euro, TrendingUp, CheckSquare, Calendar,
  Phone, Mail, Clipboard, FileText, Users,
  Plus, X, ChevronDown, ChevronRight,
  MapPin, Paperclip, Download, Clock, ArrowDownLeft, ArrowUpRight,
} from 'lucide-react'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DeadlineBadge } from '../../ProjectsManagerV2/components/DeadlineBadge'
import { useActivitiesV2 } from '../../ProjectsManagerV2/hooks/useActivitiesV2'
import { cn } from '../../../lib/utils'
import { toast } from 'sonner'
import type { ProjectV2, ProjectActivity } from '../../../types/project-v2'
import type { ActivityType } from '../../../types/project-v2'

interface ProjectOverviewProps {
  project: ProjectV2
  onRefresh: () => void
}

// ─── Config types ────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ActivityType, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  dot: string
  badge: string
  line: string
}> = {
  email:    { label: 'Email',    icon: Mail,      dot: 'bg-blue-500',    badge: 'bg-blue-500/20 text-blue-300',    line: 'border-blue-500/30' },
  call:     { label: 'Appel',    icon: Phone,     dot: 'bg-green-500',   badge: 'bg-green-500/20 text-green-300',  line: 'border-green-500/30' },
  meeting:  { label: 'RDV',      icon: Users,     dot: 'bg-violet-500',  badge: 'bg-violet-500/20 text-violet-300',line: 'border-violet-500/30' },
  decision: { label: 'Note',     icon: FileText,  dot: 'bg-purple-500',  badge: 'bg-purple-500/20 text-purple-300',line: 'border-purple-500/30' },
  task:     { label: 'Tâche',    icon: Clipboard, dot: 'bg-teal-500',    badge: 'bg-teal-500/20 text-teal-300',    line: 'border-teal-500/30' },
  file:     { label: 'Fichier',  icon: Paperclip, dot: 'bg-orange-500',  badge: 'bg-orange-500/20 text-orange-300',line: 'border-orange-500/30' },
  access:   { label: 'Accès',    icon: FileText,  dot: 'bg-yellow-500',  badge: 'bg-yellow-500/20 text-yellow-300',line: 'border-yellow-500/30' },
  status:   { label: 'Statut',   icon: Clock,     dot: 'bg-indigo-500',  badge: 'bg-indigo-500/20 text-indigo-300',line: 'border-indigo-500/30' },
  invoice:  { label: 'Facture',  icon: Euro,      dot: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300',line: 'border-emerald-500/30' },
  system:   { label: 'Système',  icon: Clock,     dot: 'bg-gray-500',    badge: 'bg-gray-500/20 text-gray-400',    line: 'border-gray-500/30' },
}

const QUICK_ACTIONS: { type: ActivityType; label: string }[] = [
  { type: 'call',     label: 'Appel' },
  { type: 'email',    label: 'Email' },
  { type: 'task',     label: 'Tâche' },
  { type: 'meeting',  label: 'RDV' },
  { type: 'decision', label: 'Note' },
]

// ─── Metric card ────────────────────────────────────────────────────────────

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

// ─── Activity card ───────────────────────────────────────────────────────────

function ActivityCard({ activity }: { activity: ProjectActivity }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.system
  const Icon = cfg.icon
  const meta = activity.metadata ?? {}

  // Email metadata
  const isEmail = activity.type === 'email'
  const isInbound = isEmail && !!(meta.direction === 'received' || meta.from)
  const emailFrom  = meta.from as string | undefined
  const emailTo    = meta.to as string | undefined
  const emailSubject = meta.subject as string | undefined
  const emailBody  = meta.body as string | undefined
  const attachments = (meta.attachments ?? []) as { filename: string; mimeType: string; attachmentId: string; size: number; messageId?: string }[]

  // Meeting metadata
  const isMeeting  = activity.type === 'meeting'
  const meetStart  = meta.start as string | undefined
  const meetEnd    = meta.end as string | undefined
  const meetLoc    = meta.location as string | undefined
  const meetAttend = (meta.attendees ?? []) as string[]
  const meetDesc   = meta.description as string | undefined

  // Call metadata
  const isCall     = activity.type === 'call'
  const callDur    = meta.duration as number | undefined   // secondes
  const callDir    = meta.direction as string | undefined  // 'inbound' | 'outbound'

  // Task metadata
  const isTask     = activity.type === 'task'
  const taskDue    = meta.due_date as string | undefined
  const taskStatus = meta.status as string | undefined

  const hasDetails = (isEmail && (emailBody || attachments.length > 0)) ||
    (isMeeting && (meetStart || meetLoc || meetAttend.length > 0 || meetDesc)) ||
    (isCall && (callDur !== undefined || callDir)) ||
    (isTask && (taskDue || taskStatus))

  return (
    <div className={cn('border rounded-xl overflow-hidden transition-all bg-[#070512]', cfg.line)}>
      {/* Header ligne */}
      <button
        className={cn(
          'w-full text-left flex items-start gap-3 px-4 py-3 transition-colors',
          hasDetails ? 'cursor-pointer hover:bg-[rgba(139,92,246,0.04)]' : 'cursor-default'
        )}
        onClick={() => hasDetails && setExpanded(v => !v)}
      >
        {/* Icône */}
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cfg.badge.replace('text-', 'text-').replace('bg-', 'bg-'))}>
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {/* Badge type */}
            <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', cfg.badge)}>
              {cfg.label}
            </span>

            {/* Direction email */}
            {isEmail && isInbound && (
              <span className="flex items-center gap-0.5 text-[10px] text-blue-400">
                <ArrowDownLeft className="h-3 w-3" /> Reçu
              </span>
            )}
            {isEmail && !isInbound && emailTo && (
              <span className="flex items-center gap-0.5 text-[10px] text-[#9ca3af]">
                <ArrowUpRight className="h-3 w-3" /> Envoyé
              </span>
            )}

            {/* Direction appel */}
            {isCall && callDir && (
              <span className={cn('flex items-center gap-0.5 text-[10px]',
                callDir === 'inbound' ? 'text-green-400' : 'text-[#9ca3af]'
              )}>
                {callDir === 'inbound'
                  ? <><ArrowDownLeft className="h-3 w-3" /> Entrant</>
                  : <><ArrowUpRight className="h-3 w-3" /> Sortant</>
                }
              </span>
            )}

            {/* Durée appel */}
            {isCall && callDur !== undefined && (
              <span className="text-[10px] text-[#9ca3af]">
                {callDur >= 60 ? `${Math.floor(callDur / 60)}m ${callDur % 60}s` : `${callDur}s`}
              </span>
            )}

            {/* Sujet email */}
            {emailSubject && (
              <span className="text-xs font-medium text-[#ede9fe] truncate">{emailSubject}</span>
            )}

            {/* RDV : date courte */}
            {isMeeting && meetStart && (
              <span className="text-xs text-violet-300 font-medium">
                {format(new Date(meetStart), 'dd MMM yyyy · HH:mm', { locale: fr })}
              </span>
            )}

            {/* Task status */}
            {isTask && taskStatus && (
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full',
                taskStatus === 'done' ? 'bg-teal-500/20 text-teal-300' : 'bg-yellow-500/20 text-yellow-300'
              )}>
                {taskStatus === 'done' ? 'Fait' : 'En cours'}
              </span>
            )}

            {/* Date relative */}
            <span className="ml-auto text-[10px] text-[#6b7280] shrink-0">
              {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: true, locale: fr })}
            </span>
          </div>

          {/* Contenu principal */}
          <p className={cn('text-xs text-[#9ca3af] leading-relaxed', !expanded && 'line-clamp-2')}>
            {activity.content}
          </p>

          {/* Expéditeur / destinataire */}
          {isEmail && (emailFrom || emailTo) && (
            <p className="text-[10px] text-[#6b7280] mt-0.5">
              {emailFrom ? `De : ${emailFrom}` : ''}
              {emailFrom && emailTo ? ' · ' : ''}
              {emailTo ? `À : ${emailTo}` : ''}
            </p>
          )}

          {/* Auteur */}
          {activity.author_name && (
            <p className="text-[10px] text-[#6b7280] mt-0.5">{activity.author_name}</p>
          )}
        </div>

        {/* Chevron expand */}
        {hasDetails && (
          <div className="shrink-0 mt-1">
            {expanded
              ? <ChevronDown className="h-3.5 w-3.5 text-[#9ca3af]" />
              : <ChevronRight className="h-3.5 w-3.5 text-[#9ca3af]" />
            }
          </div>
        )}
      </button>

      {/* Détails dépliables */}
      {expanded && hasDetails && (
        <div className={cn('border-t px-4 py-3 space-y-3 bg-[rgba(0,0,0,0.25)]', cfg.line)}>
          {/* Email : corps */}
          {isEmail && emailBody && (
            <pre className="text-xs text-[#9ca3af] bg-[rgba(139,92,246,0.04)] border border-[rgba(139,92,246,0.12)] rounded-lg p-3 whitespace-pre-wrap break-words max-h-64 overflow-y-auto leading-relaxed font-sans">
              {emailBody}
            </pre>
          )}

          {/* Email : pièces jointes */}
          {isEmail && attachments.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-[#9ca3af] flex items-center gap-1.5 font-medium">
                <Paperclip className="h-3 w-3" />
                {attachments.length} pièce{attachments.length > 1 ? 's' : ''} jointe{attachments.length > 1 ? 's' : ''}
              </p>
              {attachments.map(att => (
                <a
                  key={att.attachmentId}
                  href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-get-attachment?messageId=${meta.gmail_message_id ?? att.messageId}&attachmentId=${att.attachmentId}&filename=${encodeURIComponent(att.filename)}&mimeType=${encodeURIComponent(att.mimeType)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-[#ede9fe] bg-[rgba(139,92,246,0.06)] hover:bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.15)] rounded-lg px-3 py-2 transition-colors"
                >
                  <Download className="h-3 w-3 text-[#9ca3af] shrink-0" />
                  <span className="truncate">{att.filename}</span>
                  {att.size > 0 && (
                    <span className="text-[#6b7280] shrink-0 ml-auto">
                      {att.size > 1024 * 1024
                        ? `${(att.size / 1024 / 1024).toFixed(1)} Mo`
                        : `${Math.round(att.size / 1024)} Ko`}
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Meeting : détails */}
          {isMeeting && (
            <div className="space-y-2">
              {meetStart && (
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <Calendar className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  <span>
                    {new Date(meetStart).toLocaleString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long',
                      hour: '2-digit', minute: '2-digit',
                    })}
                    {meetEnd && (
                      <span className="text-[#6b7280]">
                        {' '}→ {new Date(meetEnd).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </span>
                </div>
              )}
              {meetLoc && (
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <MapPin className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  <span>{meetLoc}</span>
                </div>
              )}
              {meetAttend.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-[#9ca3af]">
                  <Users className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <span>{meetAttend.join(', ')}</span>
                </div>
              )}
              {meetDesc && (
                <p className="text-xs text-[#9ca3af] italic border-l-2 border-violet-500/40 pl-3 leading-relaxed">
                  {meetDesc.substring(0, 300)}{meetDesc.length > 300 ? '…' : ''}
                </p>
              )}
            </div>
          )}

          {/* Task : détails */}
          {isTask && (
            <div className="space-y-1.5">
              {taskDue && (
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <Calendar className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                  <span>Échéance : {format(parseISO(taskDue), 'd MMM yyyy', { locale: fr })}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const formatDate = (d: string | null) =>
    d ? format(parseISO(d), 'd MMM yyyy', { locale: fr }) : '—'

  const { activities, loading, addActivity } = useActivitiesV2(project.id)

  const [activeType, setActiveType] = useState<ActivityType | null>(null)
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all')

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

  const filtered = activities.filter(a => filterType === 'all' || a.type === filterType)

  return (
    <div className="space-y-5">
      {/* Métriques */}
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

      {/* Tracker activités */}
      <div className="border border-[rgba(139,92,246,0.15)] rounded-xl overflow-hidden bg-[#070512]">
        {/* En-tête */}
        <div className="px-4 py-3 border-b border-[rgba(139,92,246,0.12)] flex items-center gap-3">
          <p className="text-xs font-semibold text-[#ede9fe]">Activités</p>
          {loading && <span className="text-[10px] text-[#9ca3af]">Chargement…</span>}

          {/* Filtre type */}
          <div className="ml-auto flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={cn('text-[10px] px-2 py-0.5 rounded-full transition-colors',
                filterType === 'all'
                  ? 'bg-[rgba(139,92,246,0.2)] text-[#A78BFA]'
                  : 'text-[#9ca3af] hover:text-[#ede9fe]'
              )}
            >
              Tout
            </button>
            {QUICK_ACTIONS.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setFilterType(prev => prev === type ? 'all' : type)}
                className={cn('text-[10px] px-2 py-0.5 rounded-full transition-colors',
                  filterType === type
                    ? cn(TYPE_CONFIG[type].badge)
                    : 'text-[#9ca3af] hover:text-[#ede9fe]'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Boutons ajout rapide */}
        <div className="px-4 py-3 border-b border-[rgba(139,92,246,0.12)]">
          <div className="flex gap-2 flex-wrap">
            {QUICK_ACTIONS.map(({ type, label }) => {
              const Icon = TYPE_CONFIG[type].icon
              return (
                <button
                  key={type}
                  onClick={() => handleQuickAction(type)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                    TYPE_CONFIG[type].badge,
                    TYPE_CONFIG[type].line,
                    activeType === type ? 'ring-1 ring-[rgba(139,92,246,0.4)]' : 'opacity-70 hover:opacity-100'
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Formulaire inline */}
          {activeType && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', TYPE_CONFIG[activeType].badge)}>
                  {TYPE_CONFIG[activeType].label}
                </span>
                <button onClick={() => setActiveType(null)} className="ml-auto text-[#9ca3af] hover:text-[#ede9fe]">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Détails de ${TYPE_CONFIG[activeType].label.toLowerCase()}…`}
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

        {/* Liste activités */}
        {!loading && filtered.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-[#9ca3af] italic">Aucune activité{filterType !== 'all' ? ` de type "${TYPE_CONFIG[filterType as ActivityType]?.label}"` : ''}</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="p-3 space-y-2">
            {filtered.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
