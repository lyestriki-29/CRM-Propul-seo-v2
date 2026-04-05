import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { supabase } from '../../../lib/supabase'
import type { ProjectV2, ProjectStatusV2, PrestaType } from '../../../types/project-v2'
import { MOCK_USERS } from '../mocks/mockUsers'

interface EditProjectModalProps {
  project: ProjectV2
  onSave: (updates: Partial<ProjectV2>) => void
  onClose: () => void
}

export function EditProjectModal({ project, onSave, onClose }: EditProjectModalProps) {
  const [form, setForm] = useState({
    name:        project.name,
    description: project.description ?? '',
    status:      project.status,
    priority:    project.priority,
    presta_type: project.presta_type,
    assigned_to: project.assigned_to,
    budget:      project.budget != null ? String(project.budget) : '',
    end_date:    project.end_date ?? '',
    client_name: project.client_name ?? '',
    siret:       project.siret ?? '',
  })

  const [enriching, setEnriching] = useState(false)
  const [enrichedName, setEnrichedName] = useState<string | null>(
    project.company_enriched_at ? (project.company_data as any)?.nom_entreprise ?? (project.company_data as any)?.denomination ?? null : null
  )

  const togglePrestaType = (type: PrestaType) => {
    setForm(prev => ({
      ...prev,
      presta_type: prev.presta_type.includes(type)
        ? prev.presta_type.filter(t => t !== type)
        : [...prev.presta_type, type],
    }))
  }

  const handleEnrich = async () => {
    const cleanSiret = form.siret.replace(/\s/g, '')
    if (!/^\d{14}$/.test(cleanSiret)) {
      alert('SIRET invalide — 14 chiffres requis')
      return
    }
    setEnriching(true)
    try {
      const { data, error } = await supabase.functions.invoke('enrich-siret', {
        body: { project_id: project.id, siret: cleanSiret },
      })
      if (error) throw error
      setEnrichedName(data.company_name ?? null)
      onSave({ siret: cleanSiret })
    } catch (err) {
      alert('Erreur enrichissement Pappers')
      console.error('[enrich-siret]', err)
    } finally {
      setEnriching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const user = MOCK_USERS.find(u => u.id === form.assigned_to)
    onSave({
      name:          form.name.trim(),
      description:   form.description.trim() || null,
      status:        form.status as ProjectStatusV2,
      priority:      form.priority as ProjectV2['priority'],
      presta_type:   form.presta_type,
      assigned_to:   form.assigned_to,
      assigned_name: user?.name ?? null,
      budget:        form.budget ? parseFloat(form.budget) : null,
      end_date:      form.end_date || null,
      client_name:   form.client_name.trim() || null,
      category:      form.presta_type[0] ?? project.category,
      siret:         form.siret.trim() || null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="glass-surface-static rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-5 text-foreground">Modifier le projet</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Client</label>
            <input
              type="text"
              value={form.client_name}
              onChange={e => setForm({ ...form, client_name: e.target.value })}
              placeholder="Nom du client"
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Type de prestation</label>
            <div className="flex gap-2 flex-wrap">
              {(['web', 'seo', 'erp', 'saas'] as PrestaType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => togglePrestaType(type)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium border transition-colors',
                    form.presta_type.includes(type)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-surface-2 border-border text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Statut</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as ProjectStatusV2 })}
                className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
              >
                <option value="prospect">Prospect</option>
                <option value="brief_received">Brief reçu</option>
                <option value="quote_sent">Devis envoyé</option>
                <option value="in_progress">En cours</option>
                <option value="review">Recette</option>
                <option value="delivered">Livré</option>
                <option value="maintenance">Maintenance</option>
                <option value="on_hold">En pause</option>
                <option value="closed">Clôturé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Priorité</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value as ProjectV2['priority'] })}
                className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
              >
                <option value="low">Basse</option>
                <option value="medium">Normale</option>
                <option value="high">Haute</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Responsable</label>
              <select
                value={form.assigned_to}
                onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
              >
                <option value="">Non assigné</option>
                {MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Budget (€)</label>
              <input
                type="number"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
                placeholder="0"
                className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Échéance</label>
            <input
              type="date"
              value={form.end_date}
              onChange={e => setForm({ ...form, end_date: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">SIRET</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.siret}
                onChange={e => setForm({ ...form, siret: e.target.value })}
                placeholder="12345678901234"
                maxLength={14}
                className="flex-1 p-2 border border-border rounded-md bg-surface-2 text-foreground text-sm font-mono"
              />
              <button
                type="button"
                onClick={handleEnrich}
                disabled={enriching || form.siret.replace(/\s/g, '').length !== 14}
                className="px-3 py-2 text-xs rounded-md border border-primary text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {enriching ? '...' : 'Enrichir'}
              </button>
            </div>
            {enrichedName && (
              <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                <span>✓</span> Données enrichies via Pappers : <strong>{enrichedName}</strong>
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-md text-muted-foreground bg-surface-2 hover:bg-surface-3 text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
