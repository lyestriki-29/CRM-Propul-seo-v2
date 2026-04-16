import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectV2, StatusSiteWeb } from '../../../types/project-v2'

type SiteWebProject = ProjectV2 & { sw_status: StatusSiteWeb }

interface SiteWebNewProjectModalProps {
  open: boolean
  onSave: (data: Omit<SiteWebProject, 'id' | 'created_at' | 'updated_at'>) => void
  onClose: () => void
}

const SITEWEB_STATUSES: { value: StatusSiteWeb; label: string }[] = [
  { value: 'prospect',      label: 'Prospect' },
  { value: 'devis_envoye',  label: 'Devis envoye' },
  { value: 'signe',         label: 'Signe' },
  { value: 'en_production', label: 'En production' },
  { value: 'livre',         label: 'Livre' },
  { value: 'perdu',         label: 'Perdu' },
]

const PACKS = [
  { value: 'starter',       label: 'Starter',       price: 1480 },
  { value: 'professionnel', label: 'Professionnel',  price: 1980 },
  { value: 'entreprise',    label: 'Entreprise',     price: 2980 },
  { value: 'sur_mesure',    label: 'Sur mesure',     price: 0 },
] as const

export function SiteWebNewProjectModal({ open, onSave, onClose }: SiteWebNewProjectModalProps) {
  const [name, setName]             = useState('')
  const [clientName, setClientName] = useState('')
  const [pack, setPack]             = useState<string>('starter')
  const [budget, setBudget]         = useState('1480')
  const [swStatus, setSwStatus]     = useState<StatusSiteWeb>('prospect')

  useEffect(() => {
    if (open) {
      setName('')
      setClientName('')
      setPack('starter')
      setBudget('1480')
      setSwStatus('prospect')
    }
  }, [open])

  // Sync budget quand le pack change
  const handlePackChange = (value: string) => {
    setPack(value)
    const p = PACKS.find(pk => pk.value === value)
    if (p && p.price > 0) setBudget(String(p.price))
  }

  if (!open) return null

  const handleSave = () => {
    if (!name.trim()) return
    const now = new Date().toISOString()
    const today = now.slice(0, 10)
    onSave({
      user_id: null,
      client_id: null,
      client_name: clientName.trim() || null,
      name: name.trim(),
      description: `Pack ${PACKS.find(p => p.value === pack)?.label ?? pack} — ${clientName.trim() || name.trim()}`,
      status: 'in_progress',
      priority: 'medium',
      assigned_to: null,
      assigned_name: null,
      start_date: today,
      end_date: null,
      budget: budget ? parseFloat(budget) : null,
      progress: 0,
      category: 'site_web',
      presta_type: ['site_web'],
      completion_score: 0,
      last_activity_at: now,
      completed_at: null,
      is_archived: false,
      next_action_label: null,
      next_action_due: null,
      siret: null,
      company_data: null,
      company_enriched_at: null,
      ai_summary: null,
      ai_summary_generated_at: null,
      portal_token: null,
      portal_enabled: false,
      sw_status: swStatus,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-5" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground">Nouveau projet site web</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Nom */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom du projet *</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Ex: Site vitrine Boulangerie Dupont"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Client */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Client</label>
            <input
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="Nom du client"
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Pack */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Pack</label>
            <select
              value={pack}
              onChange={e => handlePackChange(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              {PACKS.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}{p.price > 0 ? ` — ${p.price.toLocaleString('fr-FR')}€` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Budget + Statut */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget (EUR)</label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="0"
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Statut</label>
              <select
                value={swStatus}
                onChange={e => setSwStatus(e.target.value as StatusSiteWeb)}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {SITEWEB_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            Creer
          </button>
        </div>
      </div>
    </div>
  )
}
