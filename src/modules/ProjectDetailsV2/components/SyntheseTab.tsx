import { useState } from 'react'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, Copy, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { DeadlineBadge } from '../../ProjectsManagerV2/components/DeadlineBadge'
import { useBriefV2 } from '../../ProjectsManagerV2/hooks/useBriefV2'
import { useProjectAccessesV2 } from '../../ProjectsManagerV2/hooks/useProjectAccessesV2'
import type { ProjectAccessV2 } from '../../ProjectsManagerV2/hooks/useProjectAccessesV2'
import { useActivitiesV2 } from '../../ProjectsManagerV2/hooks/useActivitiesV2'
import { ShareBriefButton } from './ShareBriefButton'
import { SyntheseFollowUpPreview } from './SyntheseFollowUpPreview'
import { MOCK_BRIEFS } from '../../ProjectsManagerV2/mocks/mockBriefs'
import { MOCK_ACTIVITIES } from '../../ProjectsManagerV2/mocks/mockActivities'
import { MOCK_ACCESSES } from '../../ProjectsManagerV2/mocks/mockAccesses'
import { cn } from '../../../lib/utils'
import type { ProjectV2, ActivityType } from '../../../types/project-v2'
import type { AccessCategory, AccessStatus } from '../../../types/project-v2'

// ---------------------------------------------------------------------------
// Access form constants
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<AccessCategory, string> = {
  hosting: 'Hébergement',
  cms: 'CMS',
  analytics: 'Analytics',
  social: 'Réseaux sociaux',
  tools: 'Outils',
  design: 'Design',
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as AccessCategory[]

const STATUS_LABELS: Record<AccessStatus, string> = {
  active: 'Actif',
  missing: 'Manquant',
  broken: 'Non fonctionnel',
  expired: 'Expiré',
  pending_validation: 'À valider',
}

const ALL_STATUSES = Object.keys(STATUS_LABELS) as AccessStatus[]

interface AccessFormState {
  label: string
  category: AccessCategory
  url: string
  login: string
  password: string
  status: AccessStatus
  notes: string
}

const DEFAULT_ACCESS_FORM: AccessFormState = {
  label: '',
  category: 'hosting',
  url: '',
  login: '',
  password: '',
  status: 'active',
  notes: '',
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SyntheseTabProps {
  project: ProjectV2
}

function CollapsibleCard({ title, headerBg, badge, defaultOpen = true, children }: {
  title: React.ReactNode
  headerBg: string
  badge?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-[#0f0f1a] border border-[rgba(139,92,246,0.15)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={cn('w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors', headerBg)}
      >
        {title}
        {badge && <span className="ml-1">{badge}</span>}
        <span className="ml-auto">
          {open
            ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          }
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-[rgba(139,92,246,0.1)]">
          {children}
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, sub, valueColor }: {
  label: string
  value: string | number
  sub?: React.ReactNode
  valueColor?: string
}) {
  return (
    <div className="bg-[#0f0f1a] border border-[rgba(139,92,246,0.15)] rounded-xl p-4 text-center">
      <p className={cn('text-[22px] font-bold', valueColor ?? 'text-[#e2e8f0]')}>{value}</p>
      <p className="text-[11px] text-[#64748b] uppercase tracking-wide mt-1">{label}</p>
      {sub && <div className="mt-1">{sub}</div>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Activity icon/color config
// ---------------------------------------------------------------------------

const ACTIVITY_CONFIG: Record<ActivityType, { icon: string; bg: string }> = {
  email:    { icon: '\u{1F4E7}', bg: 'bg-[rgba(59,130,246,0.15)]' },
  call:     { icon: '\u{1F4DE}', bg: 'bg-[rgba(16,185,129,0.15)]' },
  meeting:  { icon: '\u{1F465}', bg: 'bg-[rgba(139,92,246,0.15)]' },
  decision: { icon: '\u26A1',    bg: 'bg-[rgba(234,179,8,0.15)]' },
  task:     { icon: '\u2705',    bg: 'bg-[rgba(16,185,129,0.15)]' },
  file:     { icon: '\u{1F4CE}', bg: 'bg-[rgba(249,115,22,0.15)]' },
  access:   { icon: '\u{1F511}', bg: 'bg-[rgba(234,179,8,0.15)]' },
  status:   { icon: '\u2699\uFE0F', bg: 'bg-[rgba(249,115,22,0.15)]' },
  invoice:  { icon: '\u{1F4B0}', bg: 'bg-[rgba(234,179,8,0.15)]' },
  system:   { icon: '\u2699\uFE0F', bg: 'bg-[rgba(100,116,139,0.15)]' },
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SyntheseTab({ project }: SyntheseTabProps) {
  // Hooks (Supabase data)
  const { brief, loading: briefLoading } = useBriefV2(project.id)
  const { accesses, loading: accessLoading, addAccess, updateAccess, deleteAccess } = useProjectAccessesV2(project.id)
  const { activities, loading: actLoading } = useActivitiesV2(project.id)

  // Access CRUD state
  const [accessForm, setAccessForm] = useState<AccessFormState>(DEFAULT_ACCESS_FORM)
  const [showAccessForm, setShowAccessForm] = useState(false)
  const [editingAccessId, setEditingAccessId] = useState<string | null>(null)
  const [deletingAccessId, setDeletingAccessId] = useState<string | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())

  // Mock fallback for dev
  const displayBrief = brief ?? MOCK_BRIEFS[project.id] ?? null
  const displayAccesses = accesses.length > 0 ? accesses : (MOCK_ACCESSES[project.id] ?? [])
  const displayActivities = activities.length > 0 ? activities : (MOCK_ACTIVITIES[project.id] ?? [])
  const recentActivities = displayActivities.slice(0, 5)

  const formatDate = (d: string | null) =>
    d ? format(parseISO(d), 'd MMM yyyy', { locale: fr }) : '\u2014'

  // Access form helpers
  const openAddAccess = () => {
    setEditingAccessId(null)
    setAccessForm(DEFAULT_ACCESS_FORM)
    setShowAccessForm(true)
  }

  const openEditAccess = (acc: ProjectAccessV2) => {
    setEditingAccessId(acc.id)
    setAccessForm({
      label: acc.label,
      category: acc.category,
      url: acc.url ?? '',
      login: acc.login ?? '',
      password: acc.password ?? '',
      status: acc.status,
      notes: acc.notes ?? '',
    })
    setShowAccessForm(true)
  }

  const cancelAccessForm = () => {
    setShowAccessForm(false)
    setEditingAccessId(null)
    setAccessForm(DEFAULT_ACCESS_FORM)
  }

  const handleAccessSubmit = async () => {
    if (!accessForm.label.trim()) {
      toast.error('Le nom du service est requis')
      return
    }

    if (editingAccessId) {
      await updateAccess(editingAccessId, {
        label: accessForm.label.trim(),
        category: accessForm.category,
        url: accessForm.url.trim() || null,
        login: accessForm.login.trim() || null,
        password: accessForm.password || null,
        status: accessForm.status,
        notes: accessForm.notes.trim() || null,
      })
      toast.success('Accès mis à jour')
    } else {
      await addAccess({
        project_id: project.id,
        label: accessForm.label.trim(),
        category: accessForm.category,
        url: accessForm.url.trim() || null,
        login: accessForm.login.trim() || null,
        password: accessForm.password || null,
        status: accessForm.status,
        notes: accessForm.notes.trim() || null,
      })
      toast.success('Accès ajouté')
    }
    cancelAccessForm()
  }

  const handleDeleteAccess = async (id: string) => {
    await deleteAccess(id)
    setDeletingAccessId(null)
    toast.success('Accès supprimé')
  }

  const togglePassword = (id: string) =>
    setVisiblePasswords(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copié`)
    } catch {
      toast.error('Impossible de copier')
    }
  }

  return (
    <div className="space-y-4">
      {/* Section 1: Metriques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Budget"
          value={project.budget ? `${project.budget.toLocaleString('fr-FR')} \u20AC` : '\u2014'}
        />
        <MetricCard
          label="Progression"
          value={`${project.progress}%`}
          valueColor="text-[#a78bfa]"
        />
        <MetricCard
          label="Score"
          value={`${project.completion_score}%`}
          valueColor="text-[#22c55e]"
        />
        <MetricCard
          label="Échéance"
          value={formatDate(project.end_date)}
          valueColor="text-[#f59e0b]"
          sub={project.end_date ? <DeadlineBadge endDate={project.end_date} /> : undefined}
        />
      </div>

      {/* Section 2: Brief client */}
      <CollapsibleCard
        title={<><span>{'\u{1F4CB}'}</span> Brief client</>}
        headerBg="bg-[rgba(139,92,246,0.08)] text-[#a78bfa]"
      >
        {briefLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-48 bg-[rgba(139,92,246,0.1)] rounded" />
            <div className="h-3 w-64 bg-[rgba(139,92,246,0.1)] rounded" />
          </div>
        ) : displayBrief ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {([
                { label: 'Objectif', value: displayBrief.objective },
                { label: 'Cible', value: displayBrief.target_audience },
                { label: 'Pages / Modules', value: displayBrief.pages },
                { label: 'Techno', value: displayBrief.techno },
                { label: 'Références design', value: displayBrief.design_references },
                { label: 'Notes', value: displayBrief.notes },
              ] as const).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#64748b] uppercase tracking-wide">{label}</p>
                  <p className="text-xs text-[#e2e8f0] mt-0.5 leading-relaxed whitespace-pre-line">
                    {value || <span className="text-[#475569] italic">Non renseigné</span>}
                  </p>
                </div>
              ))}
            </div>
            {/* Partager le brief au client */}
            <div className="flex justify-end pt-2 border-t border-[rgba(139,92,246,0.1)]">
              <ShareBriefButton projectId={project.id} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#64748b] italic">Aucun brief renseigné</p>
            <div className="flex justify-end">
              <ShareBriefButton projectId={project.id} />
            </div>
          </div>
        )}
      </CollapsibleCard>

      {/* Section 3: Accès coffre-fort */}
      <CollapsibleCard
        title={<><span>{'\u{1F510}'}</span> Accès coffre-fort</>}
        headerBg="bg-[rgba(234,179,8,0.08)] text-[#eab308]"
        badge={
          <span className="text-[10px] font-normal opacity-70">
            {displayAccesses.length} service{displayAccesses.length !== 1 ? 's' : ''}
          </span>
        }
        defaultOpen={false}
      >
        {accessLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-40 bg-[rgba(139,92,246,0.1)] rounded" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Bouton ajouter */}
            <div className="flex justify-end">
              <button
                onClick={openAddAccess}
                className="flex items-center gap-1 text-xs text-[#eab308] hover:text-[#fbbf24] transition-colors font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter un accès
              </button>
            </div>

            {/* Formulaire inline (ajout/édition) */}
            {showAccessForm && (
              <div className="bg-[rgba(234,179,8,0.04)] border border-[rgba(234,179,8,0.15)] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#eab308]">
                    {editingAccessId ? "Modifier l'accès" : 'Nouvel accès'}
                  </span>
                  <button onClick={cancelAccessForm} className="text-[#64748b] hover:text-[#e2e8f0] transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#64748b] uppercase tracking-wide">Service <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={accessForm.label}
                      onChange={e => setAccessForm(f => ({ ...f, label: e.target.value }))}
                      placeholder="ex : WordPress Admin"
                      className="w-full bg-[#0a0a14] border border-[rgba(139,92,246,0.15)] rounded px-3 py-1.5 text-xs text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[rgba(234,179,8,0.4)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#64748b] uppercase tracking-wide">Catégorie</label>
                    <div className="relative">
                      <select
                        value={accessForm.category}
                        onChange={e => setAccessForm(f => ({ ...f, category: e.target.value as AccessCategory }))}
                        className="w-full appearance-none bg-[#0a0a14] border border-[rgba(139,92,246,0.15)] rounded px-3 py-1.5 text-xs text-[#e2e8f0] pr-8 focus:outline-none focus:ring-1 focus:ring-[rgba(234,179,8,0.4)]"
                      >
                        {ALL_CATEGORIES.map(c => (
                          <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-[#64748b] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#64748b] uppercase tracking-wide">URL</label>
                  <input
                    type="text"
                    value={accessForm.url}
                    onChange={e => setAccessForm(f => ({ ...f, url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-[#0a0a14] border border-[rgba(139,92,246,0.15)] rounded px-3 py-1.5 text-xs text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[rgba(234,179,8,0.4)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#64748b] uppercase tracking-wide">Login</label>
                    <input
                      type="text"
                      value={accessForm.login}
                      onChange={e => setAccessForm(f => ({ ...f, login: e.target.value }))}
                      placeholder="Identifiant"
                      className="w-full bg-[#0a0a14] border border-[rgba(139,92,246,0.15)] rounded px-3 py-1.5 text-xs text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[rgba(234,179,8,0.4)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#64748b] uppercase tracking-wide">Mot de passe</label>
                    <input
                      type="password"
                      value={accessForm.password}
                      onChange={e => setAccessForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Mot de passe"
                      className="w-full bg-[#0a0a14] border border-[rgba(139,92,246,0.15)] rounded px-3 py-1.5 text-xs text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[rgba(234,179,8,0.4)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#64748b] uppercase tracking-wide">Statut</label>
                  <div className="relative">
                    <select
                      value={accessForm.status}
                      onChange={e => setAccessForm(f => ({ ...f, status: e.target.value as AccessStatus }))}
                      className="w-full appearance-none bg-[#0a0a14] border border-[rgba(139,92,246,0.15)] rounded px-3 py-1.5 text-xs text-[#e2e8f0] pr-8 focus:outline-none focus:ring-1 focus:ring-[rgba(234,179,8,0.4)]"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-[#64748b] pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#64748b] uppercase tracking-wide">Notes</label>
                  <input
                    type="text"
                    value={accessForm.notes}
                    onChange={e => setAccessForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Notes ou informations supplémentaires"
                    className="w-full bg-[#0a0a14] border border-[rgba(139,92,246,0.15)] rounded px-3 py-1.5 text-xs text-[#e2e8f0] placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[rgba(234,179,8,0.4)]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={cancelAccessForm}
                    className="px-3 py-1.5 text-xs text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAccessSubmit}
                    className="px-3 py-1.5 text-xs bg-[rgba(234,179,8,0.15)] text-[#eab308] hover:bg-[rgba(234,179,8,0.25)] rounded transition-colors font-medium flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {editingAccessId ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </div>
            )}

            {/* Liste des accès */}
            {displayAccesses.length > 0 ? (
              <div className="space-y-0">
                {displayAccesses.map((acc: ProjectAccessV2) => (
                  <div key={acc.id} className="border-b border-[rgba(139,92,246,0.06)] last:border-b-0">
                    {/* Bandeau suppression */}
                    {deletingAccessId === acc.id && (
                      <div className="flex items-center justify-between bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded px-3 py-2 mb-1">
                        <span className="text-xs text-[#fca5a5]">Supprimer cet accès ?</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeletingAccessId(null)}
                            className="text-xs text-[#64748b] hover:text-[#e2e8f0] transition-colors px-2 py-0.5"
                          >
                            Non
                          </button>
                          <button
                            onClick={() => handleDeleteAccess(acc.id)}
                            className="text-xs text-[#fca5a5] hover:text-[#fecaca] transition-colors font-medium px-2 py-0.5 bg-[rgba(239,68,68,0.2)] rounded"
                          >
                            Oui, supprimer
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="py-2.5 space-y-1.5">
                      {/* Ligne principale : status + label + catégorie + actions */}
                      <div className="flex items-center gap-3">
                        <div className={cn('w-2 h-2 rounded-full shrink-0',
                          acc.status === 'active' ? 'bg-[#22c55e]' :
                          acc.status === 'missing' ? 'bg-[#ef4444]' :
                          acc.status === 'broken' ? 'bg-[#f59e0b]' :
                          acc.status === 'expired' ? 'bg-[#ef4444]' :
                          'bg-[#94a3b8]'
                        )} />
                        <span className="text-xs text-[#e2e8f0] font-medium flex-1">{acc.label}</span>
                        <span className="text-[10px] text-[#64748b] bg-[rgba(100,116,139,0.15)] px-1.5 py-0.5 rounded">
                          {CATEGORY_LABELS[acc.category] ?? acc.category}
                        </span>
                        <button
                          onClick={() => openEditAccess(acc)}
                          className="text-[#64748b] hover:text-[#a78bfa] transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setDeletingAccessId(acc.id)}
                          className="text-[#64748b] hover:text-[#ef4444] transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Détails : URL, login, mot de passe, notes */}
                      <div className="ml-5 space-y-1">
                        {acc.url && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#64748b] w-10 shrink-0">URL</span>
                            <a
                              href={acc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#a78bfa] hover:text-[#c4b5fd] truncate"
                            >
                              {acc.url}
                            </a>
                          </div>
                        )}
                        {acc.login && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#64748b] w-10 shrink-0">Login</span>
                            <span className="text-[10px] text-[#e2e8f0] font-mono">{acc.login}</span>
                            <button
                              onClick={() => copyToClipboard(acc.login!, 'Login')}
                              className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                              title="Copier le login"
                            >
                              <Copy className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )}
                        {acc.password && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#64748b] w-10 shrink-0">Mdp</span>
                            <span className="text-[10px] text-[#e2e8f0] font-mono">
                              {visiblePasswords.has(acc.id) ? acc.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePassword(acc.id)}
                              className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                              title={visiblePasswords.has(acc.id) ? 'Masquer' : 'Voir'}
                            >
                              {visiblePasswords.has(acc.id) ? <EyeOff className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(acc.password!, 'Mot de passe')}
                              className="text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                              title="Copier le mot de passe"
                            >
                              <Copy className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )}
                        {acc.notes && (
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] text-[#64748b] w-10 shrink-0">Notes</span>
                            <span className="text-[10px] text-[#94a3b8] italic leading-relaxed">{acc.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !showAccessForm ? (
              <div className="text-center py-4">
                <p className="text-xs text-[#64748b] italic">Aucun accès enregistré</p>
              </div>
            ) : null}
          </div>
        )}
      </CollapsibleCard>

      {/* Section 4: Activité récente */}
      <CollapsibleCard
        title={<><span>{'\u26A1'}</span> Activité récente</>}
        headerBg="bg-[rgba(16,185,129,0.08)] text-[#10b981]"
      >
        {actLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-56 bg-[rgba(139,92,246,0.1)] rounded" />
          </div>
        ) : recentActivities.length > 0 ? (
          <>
            <div className="space-y-0">
              {recentActivities.map(activity => {
                const cfg = ACTIVITY_CONFIG[activity.type] ?? ACTIVITY_CONFIG.system
                return (
                  <div key={activity.id} className="flex items-start gap-3 py-2.5 border-b border-[rgba(139,92,246,0.06)] last:border-b-0">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm', cfg.bg)}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#e2e8f0] leading-tight line-clamp-1">{activity.content}</p>
                      {activity.author_name && (
                        <p className="text-[10px] text-[#64748b] mt-0.5">{activity.author_name}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-[#475569] shrink-0">
                      {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: false, locale: fr })}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-[#a78bfa] text-center pt-3 cursor-pointer hover:underline">
              {'\u25B6'} Tout voir dans Échanges
            </p>
          </>
        ) : (
          <p className="text-xs text-[#64748b] italic">Aucune activité récente</p>
        )}
      </CollapsibleCard>

      {/* Section 5: Suivi récent */}
      <CollapsibleCard
        title={<><span>{'\uD83D\uDCCB'}</span> Suivi récent</>}
        headerBg="bg-[rgba(99,102,241,0.08)] text-[#818cf8]"
      >
        <SyntheseFollowUpPreview projectId={project.id} />
      </CollapsibleCard>
    </div>
  )
}
