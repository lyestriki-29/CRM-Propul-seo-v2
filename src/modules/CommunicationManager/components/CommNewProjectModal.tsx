import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectV2, StatusComm } from '../../../types/project-v2'

type CommProject = ProjectV2 & { comm_status: StatusComm }

interface CommNewProjectModalProps {
  open: boolean
  onSave: (data: Omit<CommProject, 'id' | 'created_at' | 'updated_at'>) => void
  onClose: () => void
}

const COMM_STATUSES: { value: StatusComm; label: string }[] = [
  { value: 'prospect',      label: 'Prospect' },
  { value: 'brief_creatif', label: 'Brief créatif' },
  { value: 'devis_envoye',  label: 'Devis envoyé' },
  { value: 'signe',         label: 'Signé' },
  { value: 'en_production', label: 'En production' },
  { value: 'actif',         label: 'Actif' },
  { value: 'termine',       label: 'Terminé' },
  { value: 'perdu',         label: 'Perdu' },
]

const TYPES_CONTRAT = [
  { value: 'abonnement',    label: 'Abonnement' },
  { value: 'branding',      label: 'Branding' },
  { value: 'photos_videos', label: 'Photos & Vidéos' },
] as const

const PACKS = [
  { value: 'starter',    label: 'Starter' },
  { value: 'premium',    label: 'Premium' },
  { value: 'excellence', label: 'Excellence' },
] as const

export function CommNewProjectModal({ open, onSave, onClose }: CommNewProjectModalProps) {
  const [name, setName]             = useState('')
  const [clientName, setClientName] = useState('')
  const [typeContrat, setTypeContrat] = useState<string>('abonnement')
  const [pack, setPack]             = useState<string>('starter')
  const [budget, setBudget]         = useState('')
  const [commStatus, setCommStatus] = useState<StatusComm>('prospect')

  useEffect(() => {
    if (open) {
      setName('')
      setClientName('')
      setTypeContrat('abonnement')
      setPack('starter')
      setBudget('')
      setCommStatus('prospect')
    }
  }, [open])

  if (!open) return null

  const handleSave = () => {
    if (!name.trim()) return
    const now = new Date().toISOString()
    const today = now.slice(0, 10)
    onSave({
      user_id: null,
      client_id: null,
      client_name: clientName.trim(),
      name: name.trim(),
      description: typeContrat === 'abonnement' ? `Pack ${pack} — ${clientName.trim()}` : name.trim(),
      status: 'in_progress',
      priority: 'medium',
      assigned_to: null,
      assigned_name: null,
      start_date: today,
      end_date: null,
      budget: budget ? parseFloat(budget) : null,
      progress: 0,
      category: 'communication',
      presta_type: ['communication'],
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
      comm_status: commStatus,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-5" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-foreground">Nouveau projet comm</h2>
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
              placeholder="Ex: Abonnement Instagram Murmure"
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

          {/* Type + Pack */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
              <select
                value={typeContrat}
                onChange={e => setTypeContrat(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {TYPES_CONTRAT.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            {typeContrat === 'abonnement' && (
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Pack</label>
                <select
                  value={pack}
                  onChange={e => setPack(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  {PACKS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Budget + Statut */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget (€)</label>
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
                value={commStatus}
                onChange={e => setCommStatus(e.target.value as StatusComm)}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                {COMM_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
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
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}
