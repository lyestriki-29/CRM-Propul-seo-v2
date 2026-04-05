import { useState } from 'react'
import { Clock, Zap, Plus, X, ChevronDown, ChevronRight, Paperclip, Download, Calendar, MapPin, Users } from 'lucide-react'
import { useActivitiesV2 } from '../../ProjectsManagerV2/hooks/useActivitiesV2'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '../../../lib/utils'
import type { ActivityType } from '../../../types/project-v2'

const TYPE_CONFIG: Record<ActivityType, { label: string; dot: string; badge: string }> = {
  email:    { label: 'Email',     dot: 'bg-blue-500',    badge: 'bg-blue-500/20 text-blue-300' },
  call:     { label: 'Appel',     dot: 'bg-green-500',   badge: 'bg-green-500/20 text-green-300' },
  meeting:  { label: 'RDV',       dot: 'bg-violet-500',  badge: 'bg-violet-500/20 text-violet-300' },
  decision: { label: 'Décision',  dot: 'bg-purple-500',  badge: 'bg-purple-500/20 text-purple-300' },
  task:     { label: 'Tâche',     dot: 'bg-teal-500',    badge: 'bg-teal-500/20 text-teal-300' },
  file:     { label: 'Fichier',   dot: 'bg-orange-500',  badge: 'bg-orange-500/20 text-orange-300' },
  access:   { label: 'Accès',     dot: 'bg-yellow-500',  badge: 'bg-yellow-500/20 text-yellow-300' },
  status:   { label: 'Statut',    dot: 'bg-indigo-500',  badge: 'bg-indigo-500/20 text-indigo-300' },
  invoice:  { label: 'Facture',   dot: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300' },
  system:   { label: 'Système',   dot: 'bg-gray-500',    badge: 'bg-gray-500/20 text-gray-400' },
}

const ALL_TYPES = Object.keys(TYPE_CONFIG) as ActivityType[]

interface AddFormState {
  type: ActivityType
  content: string
  author_name: string
}

const DEFAULT_FORM: AddFormState = { type: 'call', content: '', author_name: '' }

interface ProjectTimelineProps {
  projectId: string
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const { activities, addActivity } = useActivitiesV2(projectId)
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all')
  const [filterAuthor, setFilterAuthor] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddFormState>(DEFAULT_FORM)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const allActivities = activities
    .filter(a => filterType === 'all' || a.type === filterType)
    .filter(a =>
      filterAuthor.trim() === '' ||
      (a.author_name ?? '').toLowerCase().includes(filterAuthor.trim().toLowerCase())
    )

  const handleAdd = async () => {
    if (!form.content.trim()) {
      toast.error('Le contenu est requis')
      return
    }
    await addActivity({
      type: form.type,
      content: form.content.trim(),
      author_name: form.author_name.trim() || undefined,
    })
    setForm(DEFAULT_FORM)
    setShowForm(false)
    toast.success('Activité ajoutée')
  }

  const handleCancel = () => {
    setForm(DEFAULT_FORM)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Journal d'activité</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Temps réel
          </span>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Nouvelle entrée</span>
            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Type</label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as ActivityType }))}
                  className="w-full appearance-none bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {ALL_TYPES.map(t => (
                    <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Auteur (optionnel)</label>
              <input
                type="text"
                value={form.author_name}
                onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                placeholder="Nom de l'auteur"
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Contenu <span className="text-red-400">*</span></label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Décrivez l'activité..."
              rows={3}
              className="w-full bg-surface-3 border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors font-medium"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as ActivityType | 'all')}
            className="appearance-none bg-surface-2 border border-border rounded px-3 py-1.5 text-xs text-foreground pr-7 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="all">Tous les types</option>
            {ALL_TYPES.map(t => (
              <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>

        <input
          type="text"
          value={filterAuthor}
          onChange={e => setFilterAuthor(e.target.value)}
          placeholder="Filtrer par auteur..."
          className="bg-surface-2 border border-border rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 min-w-[160px]"
        />

        {(filterType !== 'all' || filterAuthor !== '') && (
          <button
            onClick={() => { setFilterType('all'); setFilterAuthor('') }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Réinitialiser
          </button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">
          {allActivities.length} entrée{allActivities.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Liste */}
      {allActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Clock className="h-10 w-10 opacity-30" />
          <p className="text-sm">Aucune activité pour ces critères.</p>
          {(filterType !== 'all' || filterAuthor !== '') ? (
            <p className="text-xs opacity-60">Modifiez les filtres pour voir plus d'entrées.</p>
          ) : (
            <p className="text-xs opacity-60">Le journal se remplit automatiquement au fil des actions.</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-0">
            {allActivities.map(activity => {
              const conf = TYPE_CONFIG[activity.type]
              return (
                <div key={activity.id} className="relative flex gap-4 pl-10 py-3 group">
                  <div className={cn('absolute left-2.5 top-4 h-3 w-3 rounded-full border-2 border-surface-1', conf.dot)} />
                  <div className="flex-1 min-w-0 bg-surface-2 border border-border rounded-lg p-3 group-hover:border-border/80 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', conf.badge)}>
                          {conf.label}
                        </span>
                        {activity.is_auto && (
                          <span className="text-[10px] text-muted-foreground/60">auto</span>
                        )}
                        {!activity.is_auto && (
                          <span className="text-[10px] text-primary/60">manuel</span>
                        )}
                      </div>
                      <span
                        title={format(parseISO(activity.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                        className="text-[10px] text-muted-foreground shrink-0 cursor-default"
                      >
                        {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{activity.content}</p>
                    {activity.author_name && (
                      <p className="text-xs text-muted-foreground mt-1">{activity.author_name}</p>
                    )}
                    {/* Détail RDV Google Agenda */}
                    {activity.type === 'meeting' && activity.metadata && (
                      <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                        {activity.metadata.start && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 shrink-0 text-violet-400" />
                            <span>
                              {new Date(activity.metadata.start as string).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                              {activity.metadata.end && (
                                <span className="text-muted-foreground/60">
                                  {' '}→ {new Date(activity.metadata.end as string).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        {activity.metadata.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 shrink-0 text-violet-400" />
                            <span>{activity.metadata.location as string}</span>
                          </div>
                        )}
                        {activity.metadata.attendees && (activity.metadata.attendees as string[]).length > 0 && (
                          <div className="flex items-start gap-1.5">
                            <Users className="h-3 w-3 shrink-0 text-violet-400 mt-0.5" />
                            <span>{(activity.metadata.attendees as string[]).join(', ')}</span>
                          </div>
                        )}
                        {activity.metadata.description && (
                          <p className="text-xs text-muted-foreground/70 italic pl-4 border-l border-violet-500/30 mt-1">
                            {(activity.metadata.description as string).substring(0, 200)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Contenu email expandable */}
                    {activity.type === 'email' && activity.metadata?.body && (
                      <div className="mt-2">
                        <button
                          onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                          className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
                        >
                          {expandedId === activity.id ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          {expandedId === activity.id ? 'Masquer le contenu' : 'Voir le contenu'}
                        </button>
                        {expandedId === activity.id && (
                          <div className="mt-2 space-y-2">
                            <pre className="text-xs text-muted-foreground bg-surface-3 rounded p-3 whitespace-pre-wrap break-words max-h-64 overflow-y-auto leading-relaxed">
                              {activity.metadata.body}
                            </pre>
                            {activity.metadata.attachments?.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Paperclip className="h-3 w-3" />
                                  {activity.metadata.attachments.length} pièce{activity.metadata.attachments.length > 1 ? 's' : ''} jointe{activity.metadata.attachments.length > 1 ? 's' : ''}
                                </p>
                                {activity.metadata.attachments.map((att: { filename: string; mimeType: string; attachmentId: string; size: number }) => (
                                  <a
                                    key={att.attachmentId}
                                    href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gmail-get-attachment?messageId=${activity.metadata.gmail_message_id}&attachmentId=${att.attachmentId}&filename=${encodeURIComponent(att.filename)}&mimeType=${encodeURIComponent(att.mimeType)}`}
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
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
