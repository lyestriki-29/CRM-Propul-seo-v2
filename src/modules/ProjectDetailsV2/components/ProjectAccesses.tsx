import { useState } from 'react'
import { Key, Lock, Globe, Copy, Eye, EyeOff, Plus, Pencil, Trash2, X, ChevronDown, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../../lib/utils'
import type { AccessCategory, AccessStatus, ProjectAccess } from '../../../types/project-v2'

const CATEGORY_LABELS: Record<AccessCategory, string> = {
  hosting:   'Hébergement',
  cms:       'CMS',
  analytics: 'Analytics',
  social:    'Réseaux sociaux',
  tools:     'Outils',
  design:    'Design',
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as AccessCategory[]

const STATUS_COLORS: Record<AccessStatus, string> = {
  active:             'bg-green-500/20 text-green-300',
  missing:            'bg-red-500/20 text-red-300',
  broken:             'bg-orange-500/20 text-orange-300',
  expired:            'bg-gray-500/20 text-gray-400',
  pending_validation: 'bg-blue-500/20 text-blue-300',
}

const STATUS_LABELS: Record<AccessStatus, string> = {
  active:             'Actif',
  missing:            'Manquant',
  broken:             'Non fonctionnel',
  expired:            'Expiré',
  pending_validation: 'À valider',
}

const ALL_STATUSES = Object.keys(STATUS_LABELS) as AccessStatus[]

const dAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString()

const INITIAL_ACCESSES: Record<string, ProjectAccess[]> = {
  'proj-001': [
    { id: 'acc-001', project_id: 'proj-001', category: 'hosting', service_name: 'OVH Cloud', url: 'https://www.ovh.com', login: 'contact@boulangerie-dupont.fr', password: 'Ov#2025!bD', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(30), updated_at: dAgo(1) },
    { id: 'acc-002', project_id: 'proj-001', category: 'cms', service_name: 'WordPress Admin', url: 'https://boulangerie-dupont.fr/wp-admin', login: 'admin_dupont', password: 'Wp@Boul#99', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(30), updated_at: dAgo(1) },
    { id: 'acc-003', project_id: 'proj-001', category: 'analytics', service_name: 'Google Analytics', url: 'https://analytics.google.com', login: '', password: '', notes: 'Accès non encore transmis par le client', status: 'missing', detected_from_email: false, created_at: dAgo(30), updated_at: dAgo(1) },
  ],
  'proj-002': [
    { id: 'acc-011', project_id: 'proj-002', category: 'hosting', service_name: 'Infomaniak', url: 'https://www.infomaniak.com', login: 'cabinet.legrand@gmail.com', password: 'Inf#Leg2024', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(10), updated_at: dAgo(2) },
    { id: 'acc-012', project_id: 'proj-002', category: 'analytics', service_name: 'Google Search Console', url: 'https://search.google.com/search-console', login: 'cabinet.legrand@gmail.com', password: '', notes: 'Accès OAuth — se connecter avec le compte Google', status: 'active', detected_from_email: false, created_at: dAgo(10), updated_at: dAgo(2) },
    { id: 'acc-013', project_id: 'proj-002', category: 'tools', service_name: 'SEMrush', url: 'https://www.semrush.com', login: 'bob.lefevre@propulseo.fr', password: 'Sem#Prp!42', notes: 'Compte agence partagé', status: 'active', detected_from_email: false, created_at: dAgo(10), updated_at: dAgo(2) },
  ],
  'proj-003': [
    { id: 'acc-021', project_id: 'proj-003', category: 'hosting', service_name: 'AWS (démo)', url: 'https://aws.amazon.com', login: 'dev@novelia.io', password: 'Aws#Nov!2025', notes: 'Compte sandbox', status: 'pending_validation', detected_from_email: false, created_at: dAgo(5), updated_at: dAgo(1) },
    { id: 'acc-022', project_id: 'proj-003', category: 'design', service_name: 'Figma', url: 'https://figma.com', login: 'alice.martin@propulseo.fr', password: '', notes: 'Compte agence', status: 'active', detected_from_email: false, created_at: dAgo(5), updated_at: dAgo(1) },
  ],
  'proj-004': [
    { id: 'acc-031', project_id: 'proj-004', category: 'hosting', service_name: 'OVH Shared', url: 'https://www.ovh.com', login: 'contact@clinique-morin.fr', password: 'Ov#Clin2025', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(20), updated_at: dAgo(3) },
    { id: 'acc-032', project_id: 'proj-004', category: 'cms', service_name: 'WordPress Admin', url: 'https://clinique-morin.fr/wp-admin', login: 'admin_morin', password: 'Wp@Mor#88', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(20), updated_at: dAgo(3) },
    { id: 'acc-033', project_id: 'proj-004', category: 'analytics', service_name: 'Google Analytics 4', url: 'https://analytics.google.com', login: 'clinique.morin@gmail.com', password: '', notes: 'Accès OAuth via compte client', status: 'active', detected_from_email: false, created_at: dAgo(18), updated_at: dAgo(3) },
    { id: 'acc-034', project_id: 'proj-004', category: 'tools', service_name: 'Google Business Profile', url: 'https://business.google.com', login: 'clinique.morin@gmail.com', password: '', notes: 'SEO local — fiche Google', status: 'active', detected_from_email: false, created_at: dAgo(18), updated_at: dAgo(3) },
  ],
  'proj-005': [
    { id: 'acc-041', project_id: 'proj-005', category: 'hosting', service_name: 'Serveur OVH VPS', url: 'https://www.ovh.com', login: 'root@vps-immocotesud.ovh', password: 'Vps#Imm!2025X', notes: 'Accès SSH port 22', status: 'active', detected_from_email: false, created_at: dAgo(28), updated_at: dAgo(5) },
    { id: 'acc-042', project_id: 'proj-005', category: 'cms', service_name: 'Laravel Admin Panel', url: 'https://admin.immobilier-cotesud.fr', login: 'admin@immobilier-cotesud.fr', password: 'Lrv#Admin!77', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(20), updated_at: dAgo(2) },
    { id: 'acc-043', project_id: 'proj-005', category: 'analytics', service_name: 'Google Analytics 4', url: 'https://analytics.google.com', login: 'direction@immobilier-cotesud.fr', password: '', notes: null, status: 'pending_validation', detected_from_email: false, created_at: dAgo(15), updated_at: dAgo(2) },
    { id: 'acc-044', project_id: 'proj-005', category: 'tools', service_name: 'Postman API Workspace', url: 'https://www.postman.com', login: 'bob.lefevre@propulseo.fr', password: 'Pst#Api#23', notes: 'Workspace partagé équipe', status: 'active', detected_from_email: false, created_at: dAgo(25), updated_at: dAgo(5) },
  ],
  'proj-006': [
    { id: 'acc-051', project_id: 'proj-006', category: 'hosting', service_name: 'O2Switch', url: 'https://www.o2switch.fr', login: 'contact@laterrasse.fr', password: 'O2s#Ter!56', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(38), updated_at: dAgo(5) },
    { id: 'acc-052', project_id: 'proj-006', category: 'cms', service_name: 'WordPress Admin', url: 'https://laterrasse.fr/wp-admin', login: 'admin_terrasse', password: 'Wp@Ter#21', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(38), updated_at: dAgo(5) },
    { id: 'acc-053', project_id: 'proj-006', category: 'social', service_name: 'Instagram Business', url: 'https://www.instagram.com', login: 'laterrasse.restaurant', password: 'Ig#Terr!90', notes: 'Compte partagé client', status: 'active', detected_from_email: false, created_at: dAgo(30), updated_at: dAgo(5) },
  ],
  'proj-007': [
    { id: 'acc-061', project_id: 'proj-007', category: 'hosting', service_name: 'Gandi.net', url: 'https://www.gandi.net', login: 'admin@pharmacie-centrale.fr', password: 'Gnd#Phm2024', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(60), updated_at: dAgo(15) },
    { id: 'acc-062', project_id: 'proj-007', category: 'cms', service_name: 'WordPress Admin', url: 'https://pharmacie-centrale.fr/wp-admin', login: 'admin_pharma', password: 'Wp@Phm#77', notes: 'Accès transmis au client', status: 'active', detected_from_email: false, created_at: dAgo(60), updated_at: dAgo(15) },
    { id: 'acc-063', project_id: 'proj-007', category: 'analytics', service_name: 'Google Analytics 4', url: 'https://analytics.google.com', login: 'pharmacie.centrale@gmail.com', password: '', notes: 'Accès configuré et transmis', status: 'active', detected_from_email: false, created_at: dAgo(55), updated_at: dAgo(15) },
  ],
  'proj-008': [
    { id: 'acc-071', project_id: 'proj-008', category: 'analytics', service_name: 'Google Search Console', url: 'https://search.google.com/search-console', login: 'ecole.armoni@gmail.com', password: '', notes: 'OAuth — compte client', status: 'active', detected_from_email: false, created_at: dAgo(90), updated_at: dAgo(5) },
    { id: 'acc-072', project_id: 'proj-008', category: 'tools', service_name: 'Ahrefs', url: 'https://ahrefs.com', login: 'bob.lefevre@propulseo.fr', password: 'Ahr#Pro!55', notes: 'Compte agence', status: 'active', detected_from_email: false, created_at: dAgo(90), updated_at: dAgo(5) },
  ],
  'proj-009': [
    { id: 'acc-081', project_id: 'proj-009', category: 'hosting', service_name: 'Ionos', url: 'https://www.ionos.fr', login: 'contact@saveurs-du-monde.fr', password: 'Ion#Sav!88', notes: null, status: 'active', detected_from_email: false, created_at: dAgo(14), updated_at: dAgo(8) },
    { id: 'acc-082', project_id: 'proj-009', category: 'cms', service_name: 'WooCommerce Admin', url: 'https://saveurs-du-monde.fr/wp-admin', login: 'admin_saveurs', password: 'Wc@Sav#12', notes: 'Module commande en cours de dev', status: 'broken', detected_from_email: false, created_at: dAgo(12), updated_at: dAgo(8) },
  ],
  'proj-010': [
    { id: 'acc-091', project_id: 'proj-010', category: 'hosting', service_name: 'Hébergeur clôturé', url: null, login: 'contact@agence-horizon.fr', password: 'Arch!2023', notes: 'Archivé — accès transférés au client', status: 'expired', detected_from_email: false, created_at: dAgo(120), updated_at: dAgo(60) },
  ],
}

interface FormState {
  service_name: string
  category: AccessCategory
  url: string
  login: string
  password: string
  status: AccessStatus
  notes: string
}

const DEFAULT_FORM: FormState = {
  service_name: '',
  category: 'hosting',
  url: '',
  login: '',
  password: '',
  status: 'active',
  notes: '',
}

interface ProjectAccessesProps {
  projectId: string
}

export function ProjectAccesses({ projectId }: ProjectAccessesProps) {
  const [accesses, setAccesses] = useState<ProjectAccess[]>(
    () => INITIAL_ACCESSES[projectId] ?? []
  )
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)

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
      toast.error('Impossible de copier dans le presse-papier')
    }
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setShowForm(true)
  }

  const openEditForm = (access: ProjectAccess) => {
    setEditingId(access.id)
    setForm({
      service_name: access.service_name,
      category: access.category,
      url: access.url ?? '',
      login: access.login,
      password: access.password,
      status: access.status,
      notes: access.notes ?? '',
    })
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(DEFAULT_FORM)
  }

  const handleSubmit = () => {
    if (!form.service_name.trim()) {
      toast.error('Le nom du service est requis')
      return
    }
    if (!form.login.trim() && form.status === 'active') {
      toast.error('Un login est requis pour un accès actif')
      return
    }

    const timestamp = new Date().toISOString()

    if (editingId) {
      setAccesses(prev =>
        prev.map(a =>
          a.id === editingId
            ? {
                ...a,
                service_name: form.service_name.trim(),
                category: form.category,
                url: form.url.trim() || null,
                login: form.login.trim(),
                password: form.password,
                status: form.status,
                notes: form.notes.trim() || null,
                updated_at: timestamp,
              }
            : a
        )
      )
      toast.success('Accès mis à jour')
    } else {
      const newAccess: ProjectAccess = {
        id: `acc-${Date.now()}`,
        project_id: projectId,
        service_name: form.service_name.trim(),
        category: form.category,
        url: form.url.trim() || null,
        login: form.login.trim(),
        password: form.password,
        status: form.status,
        notes: form.notes.trim() || null,
        detected_from_email: false,
        created_at: timestamp,
        updated_at: timestamp,
      }
      setAccesses(prev => [newAccess, ...prev])
      toast.success('Accès ajouté')
    }

    cancelForm()
  }

  const confirmDelete = (id: string) => {
    setAccesses(prev => prev.filter(a => a.id !== id))
    setDeletingId(null)
    toast.success('Accès supprimé')
  }

  const byCategory = accesses.reduce<Record<AccessCategory, ProjectAccess[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<AccessCategory, ProjectAccess[]>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Coffre-fort accès</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" />
            {accesses.length} accès
          </span>
          <button
            onClick={openAddForm}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter un accès
          </button>
        </div>
      </div>

      {/* Formulaire inline */}
      {showForm && (
        <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {editingId ? "Modifier l'accès" : 'Nouvel accès'}
            </span>
            <button onClick={cancelForm} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Nom du service <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.service_name}
                onChange={e => setForm(f => ({ ...f, service_name: e.target.value }))}
                placeholder="ex : WordPress Admin"
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Catégorie</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as AccessCategory }))}
                  className="w-full appearance-none bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {ALL_CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">URL</label>
            <input
              type="text"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Login</label>
              <input
                type="text"
                value={form.login}
                onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                placeholder="Identifiant"
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Mot de passe"
                className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Statut</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as AccessStatus }))}
                className="w-full appearance-none bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Notes (optionnel)</label>
            <input
              type="text"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Notes ou informations supplémentaires"
              className="w-full bg-surface-3 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={cancelForm}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
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

      {/* Liste vide */}
      {accesses.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Key className="h-10 w-10 opacity-30" />
          <p className="text-sm">Aucun accès enregistré pour ce projet.</p>
          <button
            onClick={openAddForm}
            className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter le premier accès
          </button>
        </div>
      )}

      {/* Groupes par catégorie */}
      {Object.entries(byCategory).map(([cat, catAccesses]) => (
        <div key={cat} className="bg-surface-2 border border-border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-surface-3/30">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {CATEGORY_LABELS[cat as AccessCategory]}
            </span>
            <span className="ml-auto text-xs text-muted-foreground">{catAccesses.length}</span>
          </div>

          <div className="divide-y divide-border/30">
            {catAccesses.map(access => (
              <div key={access.id} className="p-4 space-y-2">
                {/* Bandeau de confirmation suppression */}
                {deletingId === access.id && (
                  <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded px-3 py-2 mb-2">
                    <span className="text-xs text-red-300">Supprimer cet accès ?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5"
                      >
                        Non
                      </button>
                      <button
                        onClick={() => confirmDelete(access.id)}
                        className="text-xs text-red-300 hover:text-red-200 transition-colors font-medium px-2 py-0.5 bg-red-500/20 rounded"
                      >
                        Oui, supprimer
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{access.service_name}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded', STATUS_COLORS[access.status])}>
                      {STATUS_LABELS[access.status]}
                    </span>
                    <button
                      onClick={() => openEditForm(access)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(access.id)}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {access.url && (
                  <a
                    href={access.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors w-fit"
                  >
                    <Globe className="h-3 w-3" />
                    {access.url}
                  </a>
                )}

                {access.login && (
                  <div className="flex items-center gap-2 bg-surface-3 rounded px-3 py-1.5">
                    <span className="text-xs text-muted-foreground shrink-0">Login :</span>
                    <span className="text-xs text-foreground font-mono flex-1 truncate">{access.login}</span>
                    <button
                      onClick={() => copyToClipboard(access.login, 'Login')}
                      className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {access.password && (
                  <div className="flex items-center gap-2 bg-surface-3 rounded px-3 py-1.5">
                    <span className="text-xs text-muted-foreground shrink-0">Mdp :</span>
                    <span className="text-xs text-foreground font-mono flex-1 truncate">
                      {visiblePasswords.has(access.id) ? access.password : '••••••••••'}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => togglePassword(access.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {visiblePasswords.has(access.id)
                          ? <EyeOff className="h-3 w-3" />
                          : <Eye className="h-3 w-3" />
                        }
                      </button>
                      <button
                        onClick={() => copyToClipboard(access.password, 'Mot de passe')}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                {access.notes && (
                  <p className="text-xs text-muted-foreground italic">{access.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
