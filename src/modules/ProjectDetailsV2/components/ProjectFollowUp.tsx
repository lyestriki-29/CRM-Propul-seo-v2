import { useState, useMemo } from 'react'
import {
  Phone, Video, Mail, MessageSquare, Plus, Pencil, Trash2, Check, X,
  ChevronDown, Clock, CheckCircle2, Circle, Eye, Copy,
  Calendar, MapPin, Users, ChevronRight, Paperclip, Download,
  Tag, Inbox, RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { format, parseISO, isFuture, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '../../../lib/utils'
import type { FollowUpType } from '../../../types/project-v2'
import { useFollowUpsV2 } from '../../ProjectsManagerV2/hooks/useFollowUpsV2'
import { useActivitiesV2 } from '../../ProjectsManagerV2/hooks/useActivitiesV2'
import { useEmailTracking } from '../../ProjectsManagerV2/hooks/useEmailTracking'
import { ProjectEmailRules } from './ProjectEmailRules'
import type { FollowUpEntry } from '../../../types/project-v2'

// ─── Catégories d'email ───────────────────────────────────────────────────────

const EMAIL_CATS = [
  { id: 'devis',         label: 'Devis / Offre',   color: 'bg-blue-500/20 text-blue-300',    dot: 'bg-blue-500' },
  { id: 'contrat',       label: 'Contrat',          color: 'bg-purple-500/20 text-purple-300', dot: 'bg-purple-500' },
  { id: 'facturation',   label: 'Facturation',      color: 'bg-green-500/20 text-green-300',  dot: 'bg-green-500' },
  { id: 'communication', label: 'Communication',    color: 'bg-teal-500/20 text-teal-300',    dot: 'bg-teal-500' },
  { id: 'support',       label: 'Support',          color: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-500' },
  { id: 'autre',         label: 'Autre',            color: 'bg-gray-500/20 text-gray-400',    dot: 'bg-gray-500' },
] as const
type EmailCatId = typeof EMAIL_CATS[number]['id']

function getEmailCat(id: string | undefined) {
  return EMAIL_CATS.find(c => c.id === id) ?? EMAIL_CATS[EMAIL_CATS.length - 1]
}

// ─── Config FollowUp manuel ───────────────────────────────────────────────────

const FOLLOWUP_TYPE_CONFIG: Record<FollowUpType, { label: string; icon: typeof Phone; color: string }> = {
  rdv:   { label: 'RDV',   icon: Video,         color: 'bg-purple-500/20 text-purple-300' },
  appel: { label: 'Appel', icon: Phone,         color: 'bg-blue-500/20 text-blue-300' },
  email: { label: 'Email', icon: Mail,          color: 'bg-teal-500/20 text-teal-300' },
  autre: { label: 'Autre', icon: MessageSquare, color: 'bg-gray-500/20 text-gray-400' },
}

const EMPTY_FORM = {
  type: 'appel' as FollowUpType,
  date: new Date().toISOString().split('T')[0],
  summary: '',
  follow_up_action: '',
  follow_up_date: '',
  assigned_to: '',
}

// ─── Onglets internes ─────────────────────────────────────────────────────────

type SuiviTab = 'rdv' | 'emails' | 'suivi'

// ─── Composant principal ──────────────────────────────────────────────────────

export function ProjectFollowUp({ projectId }: { projectId: string }) {
  const [tab, setTab]       = useState<SuiviTab>('suivi')
  const [syncing, setSyncing] = useState(false)

  const { followUps, addFollowUp, updateFollowUp, deleteFollowUp, toggleDone } = useFollowUpsV2(projectId)
  const { activities, updateActivity, refetch } = useActivitiesV2(projectId)
  const { createTracking } = useEmailTracking(projectId)

  const meetings = useMemo(() => activities.filter(a => a.type === 'meeting'), [activities])
  const emails   = useMemo(() => activities.filter(a => a.type === 'email'),   [activities])

  const pendingActions = followUps.filter(e => e.follow_up_action && !e.follow_up_done).length

  const triggerSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-sync`,
        { method: 'POST', headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` } }
      )
      const data = await res.json()
      if (res.ok) {
        toast.success(`Sync terminée — ${data.synced ?? 0} nouveau${data.synced !== 1 ? 'x' : ''} élément${data.synced !== 1 ? 's' : ''}`)
        refetch()
      } else {
        toast.error('Erreur lors de la synchronisation Gmail')
      }
    } catch {
      toast.error('Erreur réseau')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Onglets + bouton sync */}
      <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1 border-b border-border flex-1">
        <TabBtn active={tab === 'suivi'} onClick={() => setTab('suivi')} icon={<MessageSquare className="h-3.5 w-3.5" />}>
          Suivi
          {pendingActions > 0 && (
            <span className="ml-1 text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded-full">{pendingActions}</span>
          )}
        </TabBtn>
        <TabBtn active={tab === 'rdv'} onClick={() => setTab('rdv')} icon={<Video className="h-3.5 w-3.5" />}>
          RDV
          {meetings.length > 0 && (
            <span className="ml-1 text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full">{meetings.length}</span>
          )}
        </TabBtn>
        <TabBtn active={tab === 'emails'} onClick={() => setTab('emails')} icon={<Mail className="h-3.5 w-3.5" />}>
          Emails
          {emails.length > 0 && (
            <span className="ml-1 text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-full">{emails.length}</span>
          )}
        </TabBtn>
      </div>

        {/* Bouton sync Gmail */}
        {(tab === 'rdv' || tab === 'emails') && (
          <button
            onClick={triggerSync}
            disabled={syncing}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-border/80 rounded px-2.5 py-1.5 transition-colors shrink-0"
            title="Synchroniser Gmail"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', syncing && 'animate-spin')} />
            <span className="hidden sm:inline">{syncing ? 'Sync...' : 'Sync Gmail'}</span>
          </button>
        )}
      </div>

      {tab === 'rdv'    && <RdvSection    meetings={meetings} />}
      {tab === 'emails' && (
        <>
          <div className="bg-surface-2 border border-border rounded-lg p-4">
            <ProjectEmailRules projectId={projectId} />
          </div>
          <EmailsSection emails={emails} updateActivity={updateActivity} />
        </>
      )}
      {tab === 'suivi'  && (
        <SuiviSection
          projectId={projectId}
          followUps={followUps}
          addFollowUp={addFollowUp}
          updateFollowUp={updateFollowUp}
          deleteFollowUp={deleteFollowUp}
          toggleDone={toggleDone}
          createTracking={createTracking}
        />
      )}
    </div>
  )
}

// ─── Bouton onglet ────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, children }: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      )}
    >
      {icon}
      {children}
    </button>
  )
}

// ─── Section RDV ──────────────────────────────────────────────────────────────

function RdvSection({ meetings }: { meetings: ReturnType<typeof useActivitiesV2>['activities'] }) {
  const upcoming = meetings.filter(m => {
    const start = m.metadata?.start as string | undefined
    if (!start) return false
    return isFuture(new Date(start)) || isToday(new Date(start))
  }).sort((a, b) => new Date(a.metadata!.start as string).getTime() - new Date(b.metadata!.start as string).getTime())

  const past = meetings.filter(m => {
    const start = m.metadata?.start as string | undefined
    if (!start) return true
    return !isFuture(new Date(start)) && !isToday(new Date(start))
  }).sort((a, b) => new Date(b.metadata?.start as string ?? b.created_at).getTime() - new Date(a.metadata?.start as string ?? a.created_at).getTime())

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <Video className="h-10 w-10 opacity-30" />
        <p className="text-sm">Aucun rendez-vous synchronisé depuis Gmail.</p>
        <p className="text-xs opacity-60">Les invitations .ics reçues par email apparaissent ici automatiquement.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-violet-400" />
            À venir · {upcoming.length}
          </h4>
          {upcoming.map(m => <MeetingCard key={m.id} meeting={m} upcoming />)}
        </div>
      )}
      {past.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Passés · {past.length}
          </h4>
          {past.map(m => <MeetingCard key={m.id} meeting={m} />)}
        </div>
      )}
    </div>
  )
}

function MeetingCard({ meeting, upcoming }: { meeting: ReturnType<typeof useActivitiesV2>['activities'][0]; upcoming?: boolean }) {
  const meta = meeting.metadata ?? {}
  const start = meta.start as string | undefined
  const end   = meta.end   as string | undefined

  return (
    <div className={cn(
      'bg-surface-2 border rounded-lg p-4 space-y-2',
      upcoming ? 'border-violet-500/30' : 'border-border'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded',
            upcoming ? 'bg-violet-500/20 text-violet-300' : 'bg-gray-500/20 text-gray-400'
          )}>
            {upcoming ? 'À venir' : 'Passé'}
          </span>
        </div>
        {start && (
          <span className="text-[10px] text-muted-foreground shrink-0">
            {format(new Date(start), 'dd MMM yyyy', { locale: fr })}
          </span>
        )}
      </div>

      <p className="text-sm font-medium text-foreground">{meeting.content}</p>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        {start && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 shrink-0 text-violet-400" />
            <span>
              {format(new Date(start), 'EEEE d MMMM yyyy · HH:mm', { locale: fr })}
              {end && (
                <span className="text-muted-foreground/60">
                  {' '}→ {format(new Date(end), 'HH:mm', { locale: fr })}
                </span>
              )}
            </span>
          </div>
        )}
        {meta.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-violet-400" />
            <span>{meta.location as string}</span>
          </div>
        )}
        {(meta.attendees as string[] | undefined)?.length ? (
          <div className="flex items-start gap-1.5">
            <Users className="h-3 w-3 shrink-0 text-violet-400 mt-0.5" />
            <span>{(meta.attendees as string[]).join(', ')}</span>
          </div>
        ) : null}
        {meta.description && (
          <p className="text-xs text-muted-foreground/70 italic pl-4 border-l border-violet-500/30 mt-1">
            {(meta.description as string).substring(0, 200)}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Section Emails ───────────────────────────────────────────────────────────

function EmailsSection({
  emails,
  updateActivity,
}: {
  emails: ReturnType<typeof useActivitiesV2>['activities']
  updateActivity: ReturnType<typeof useActivitiesV2>['updateActivity']
}) {
  const [expandedId, setExpandedId]   = useState<string | null>(null)
  const [collapsed, setCollapsed]     = useState<Record<string, boolean>>({})

  const grouped = useMemo(() => {
    const map: Record<EmailCatId, typeof emails> = {
      devis: [], contrat: [], facturation: [], communication: [], support: [], autre: [],
    }
    for (const e of emails) {
      const cat = (e.metadata?.email_category as EmailCatId | undefined) ?? 'autre'
      map[cat].push(e)
    }
    return EMAIL_CATS.map(c => ({ ...c, items: map[c.id] })).filter(g => g.items.length > 0)
  }, [emails])

  const handleCategoryChange = async (activityId: string, newCat: EmailCatId, currentMeta: Record<string, unknown>) => {
    await updateActivity(activityId, { metadata: { ...currentMeta, email_category: newCat } })
    toast.success('Catégorie mise à jour')
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <Inbox className="h-10 w-10 opacity-30" />
        <p className="text-sm">Aucun email synchronisé depuis Gmail.</p>
        <p className="text-xs opacity-60">Les emails liés à ce projet apparaissent ici automatiquement.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {grouped.map(group => {
        const isCollapsed = collapsed[group.id] ?? false
        return (
          <div key={group.id} className="bg-surface-2 border border-border rounded-lg overflow-hidden">
            {/* En-tête groupe */}
            <button
              onClick={() => setCollapsed(s => ({ ...s, [group.id]: !s[group.id] }))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-3 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', group.dot)} />
                <span className="text-sm font-medium text-foreground">{group.label}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', group.color)}>
                  {group.items.length}
                </span>
              </div>
              {isCollapsed
                ? <ChevronRight className="h-4 w-4 text-muted-foreground" />
                : <ChevronDown  className="h-4 w-4 text-muted-foreground" />
              }
            </button>

            {/* Emails du groupe */}
            {!isCollapsed && (
              <div className="divide-y divide-border/50">
                {group.items.map(email => {
                  const meta = email.metadata ?? {}
                  const isExpanded = expandedId === email.id
                  const catId = (meta.email_category as EmailCatId | undefined) ?? 'autre'

                  return (
                    <div key={email.id} className="px-4 py-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium truncate">{email.content}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">
                              {format(parseISO(email.created_at), 'd MMM yyyy · HH:mm', { locale: fr })}
                            </span>
                            {email.author_name && (
                              <span className="text-[10px] text-muted-foreground">· {email.author_name}</span>
                            )}
                          </div>
                        </div>

                        {/* Sélecteur de catégorie */}
                        <div className="relative shrink-0">
                          <select
                            value={catId}
                            onChange={e => handleCategoryChange(email.id, e.target.value as EmailCatId, meta)}
                            className="appearance-none text-[10px] bg-surface-3 border border-border rounded px-2 py-1 text-muted-foreground pr-5 focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                            title="Changer la catégorie"
                          >
                            {EMAIL_CATS.map(c => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                          <Tag className="absolute right-1.5 top-1.5 h-2.5 w-2.5 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      {/* Corps expandable */}
                      {meta.body && (
                        <div>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : email.id)}
                            className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
                          >
                            {isExpanded
                              ? <ChevronDown  className="h-3 w-3" />
                              : <ChevronRight className="h-3 w-3" />
                            }
                            {isExpanded ? 'Masquer le contenu' : 'Voir le contenu'}
                          </button>
                          {isExpanded && (
                            <div className="mt-2 space-y-2">
                              <pre className="text-xs text-muted-foreground bg-surface-3 rounded p-3 whitespace-pre-wrap break-words max-h-64 overflow-y-auto leading-relaxed">
                                {meta.body as string}
                              </pre>
                              {(meta.attachments as Array<{ filename: string; mimeType: string; attachmentId: string; size: number }> | undefined)?.length ? (
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" />
                                    {(meta.attachments as unknown[]).length} pièce{(meta.attachments as unknown[]).length > 1 ? 's' : ''} jointe{(meta.attachments as unknown[]).length > 1 ? 's' : ''}
                                  </p>
                                  {(meta.attachments as Array<{ filename: string; mimeType: string; attachmentId: string; size: number }>).map(att => (
                                    <a
                                      key={att.attachmentId}
                                      href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-get-attachment?messageId=${meta.gmail_message_id}&attachmentId=${att.attachmentId}&filename=${encodeURIComponent(att.filename)}&mimeType=${encodeURIComponent(att.mimeType)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-xs text-foreground bg-surface-3 hover:bg-surface-2 border border-border rounded px-2 py-1.5 transition-colors"
                                    >
                                      <Download className="h-3 w-3 text-muted-foreground shrink-0" />
                                      <span className="truncate">{att.filename}</span>
                                      {att.size > 0 && (
                                        <span className="text-muted-foreground shrink-0 ml-auto">
                                          {att.size > 1024 * 1024 ? `${(att.size / 1024 / 1024).toFixed(1)} Mo` : `${Math.round(att.size / 1024)} Ko`}
                                        </span>
                                      )}
                                    </a>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Section Suivi (entrées manuelles) ────────────────────────────────────────

function SuiviSection({
  projectId,
  followUps,
  addFollowUp,
  updateFollowUp,
  deleteFollowUp,
  toggleDone,
  createTracking,
}: {
  projectId: string
  followUps: FollowUpEntry[]
  addFollowUp: ReturnType<typeof useFollowUpsV2>['addFollowUp']
  updateFollowUp: ReturnType<typeof useFollowUpsV2>['updateFollowUp']
  deleteFollowUp: ReturnType<typeof useFollowUpsV2>['deleteFollowUp']
  toggleDone: ReturnType<typeof useFollowUpsV2>['toggleDone']
  createTracking: ReturnType<typeof useEmailTracking>['createTracking']
}) {
  const [showForm, setShowForm]   = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [pixelHtml, setPixelHtml] = useState<string | null>(null)

  const pendingActions = followUps.filter(e => e.follow_up_action && !e.follow_up_done).length

  const handleGeneratePixel = async () => {
    const result = await createTracking(form.summary || 'Email suivi')
    if (result) {
      setPixelHtml(result.pixelHtml)
      await navigator.clipboard.writeText(result.pixelHtml).catch(() => {})
      toast.success('Pixel copié — colle-le dans ton email avant d\'envoyer')
    } else {
      toast.error('Erreur lors de la génération du pixel')
    }
  }

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }

  const openEdit = (entry: FollowUpEntry) => {
    setEditingId(entry.id)
    setForm({
      type:             entry.type,
      date:             entry.date,
      summary:          entry.summary,
      follow_up_action: entry.follow_up_action ?? '',
      follow_up_date:   entry.follow_up_date   ?? '',
      assigned_to:      entry.assigned_to      ?? '',
    })
    setShowForm(true)
  }

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM) }

  const handleSubmit = async () => {
    if (!form.summary.trim()) { toast.error('Le résumé est requis'); return }
    if (!form.date)           { toast.error('La date est requise');  return }

    if (editingId) {
      await updateFollowUp(editingId, {
        type:             form.type,
        date:             form.date,
        summary:          form.summary.trim(),
        follow_up_action: form.follow_up_action.trim() || null,
        follow_up_date:   form.follow_up_date || null,
        assigned_to:      form.assigned_to || null,
      })
      toast.success('Entrée mise à jour')
    } else {
      await addFollowUp({
        project_id:       projectId,
        type:             form.type,
        date:             form.date,
        summary:          form.summary.trim(),
        follow_up_action: form.follow_up_action.trim() || null,
        follow_up_date:   form.follow_up_date || null,
        follow_up_done:   false,
        assigned_to:      form.assigned_to || null,
        assigned_name:    null,
      })
      toast.success('Entrée ajoutée')
    }
    cancelForm()
  }

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Suivi du dossier</h3>
          {pendingActions > 0 && (
            <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-medium">
              {pendingActions} action{pendingActions > 1 ? 's' : ''} en attente
            </span>
          )}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvelle entrée
        </button>
      </div>

      {/* Formulaire inline */}
      {showForm && (
        <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {editingId ? "Modifier l'entrée" : 'Nouvelle entrée de suivi'}
            </span>
            <button onClick={cancelForm} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Type</label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as FollowUpType }))}
                  className="w-full appearance-none bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {(Object.keys(FOLLOWUP_TYPE_CONFIG) as FollowUpType[]).map(t => (
                    <option key={t} value={t}>{FOLLOWUP_TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Date <span className="text-red-400">*</span></label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Résumé <span className="text-red-400">*</span></label>
            <textarea
              value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              placeholder="Que s'est-il passé lors de cet échange ?"
              rows={3}
              className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            {form.type === 'email' && (
              <div className="pt-1 space-y-1">
                <button
                  type="button"
                  onClick={handleGeneratePixel}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Générer pixel de tracking (copié auto)
                </button>
                {pixelHtml && (
                  <div className="flex items-center gap-2 bg-surface-3 border border-border rounded px-2 py-1">
                    <Copy className="h-3 w-3 text-muted-foreground shrink-0" />
                    <p className="text-[10px] text-muted-foreground font-mono truncate flex-1">{pixelHtml}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border/50 pt-3 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Action de suivi (optionnel)</p>
            <input
              type="text"
              value={form.follow_up_action}
              onChange={e => setForm(f => ({ ...f, follow_up_action: e.target.value }))}
              placeholder="ex : Envoyer le devis, Relancer dans 2 semaines..."
              className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Échéance</label>
                <input
                  type="date"
                  value={form.follow_up_date}
                  onChange={e => setForm(f => ({ ...f, follow_up_date: e.target.value }))}
                  className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Responsable</label>
                <input
                  type="text"
                  value={form.assigned_to}
                  onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
                  placeholder="Nom du responsable"
                  className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={cancelForm} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors font-medium flex items-center gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              {editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-3">
        {followUps.map(entry => {
          const conf = FOLLOWUP_TYPE_CONFIG[entry.type]
          const TypeIcon = conf.icon
          const isOverdue = entry.follow_up_date && !entry.follow_up_done && new Date(entry.follow_up_date) < new Date()

          return (
            <div key={entry.id} className="bg-surface-2 border border-border rounded-lg overflow-hidden">
              {deletingId === entry.id && (
                <div className="flex items-center justify-between bg-red-500/10 border-b border-red-500/20 px-4 py-2">
                  <span className="text-xs text-red-300">Supprimer cette entrée ?</span>
                  <div className="flex gap-2">
                    <button onClick={() => setDeletingId(null)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5">Non</button>
                    <button
                      onClick={async () => { await deleteFollowUp(entry.id); setDeletingId(null); toast.success('Entrée supprimée') }}
                      className="text-xs text-red-300 hover:text-red-200 font-medium px-2 py-0.5 bg-red-500/20 rounded"
                    >
                      Oui
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('p-1.5 rounded-md', conf.color.split(' ')[0] + '/10')}>
                      <TypeIcon className={cn('h-4 w-4', conf.color.split(' ')[1])} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[10px] px-2 py-0.5 rounded font-medium', conf.color)}>
                          {conf.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{entry.date}</span>
                        {entry.assigned_name && (
                          <span className="text-xs text-muted-foreground">· {entry.assigned_name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(entry)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeletingId(entry.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{entry.summary}</p>

                {entry.follow_up_action && (
                  <div className={cn(
                    'flex items-start gap-2 rounded-md px-3 py-2 border',
                    entry.follow_up_done
                      ? 'bg-green-500/5 border-green-500/20'
                      : isOverdue
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-orange-500/5 border-orange-500/20'
                  )}>
                    <button
                      onClick={() => toggleDone(entry.id, !entry.follow_up_done)}
                      className={cn('shrink-0 mt-0.5 transition-colors', entry.follow_up_done ? 'text-green-400' : 'text-muted-foreground hover:text-foreground')}
                    >
                      {entry.follow_up_done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium', entry.follow_up_done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                        {entry.follow_up_action}
                      </p>
                      {entry.follow_up_date && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className={cn('text-[10px]', entry.follow_up_done ? 'text-muted-foreground' : isOverdue ? 'text-red-400 font-medium' : 'text-muted-foreground')}>
                            {isOverdue && !entry.follow_up_done ? 'En retard · ' : ''}
                            {entry.follow_up_date}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {followUps.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <MessageSquare className="h-10 w-10 opacity-30" />
          <p className="text-sm">Aucune entrée de suivi pour ce projet.</p>
          <button onClick={openAdd} className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            Ajouter la première entrée
          </button>
        </div>
      )}
    </div>
  )
}
