import React, { useState } from 'react'
import type { BriefERP, ModuleERP } from '../../../types/project-v2'
import { MOCK_ERP_BRIEFS } from '../mocks'

const MODULE_LABELS: Record<ModuleERP, string> = {
  gestion_commerciale: 'Gestion commerciale (devis, facturation)',
  crm_suivi: 'CRM & suivi client',
  gestion_projets: 'Gestion de projets',
  stocks_logistique: 'Stocks & logistique',
  suivi_financier: 'Suivi financier',
  multi_utilisateurs: 'Multi-utilisateurs (rôles & permissions)',
  tableaux_bord: 'Tableaux de bord KPI',
  connexions_api: 'Connexions API (outils externes)',
  sur_mesure: 'Module sur mesure',
}

const ALL_MODULES = Object.keys(MODULE_LABELS) as ModuleERP[]

interface Props { projectId: string }

export function ERPBriefTab({ projectId }: Props) {
  const initial = MOCK_ERP_BRIEFS[projectId] ?? null
  const [brief, setBrief] = useState<BriefERP | null>(initial)

  if (!brief) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Aucun brief — <button className="text-primary underline" onClick={() => {
          const now = new Date().toISOString()
          setBrief({ id: `erpb-${Date.now()}`, project_id: projectId, status: 'draft', modules: [], nb_utilisateurs: null, budget: null, outils_integres: null, url_deploiement: null, created_at: now, updated_at: now })
        }}>Créer le brief</button>
      </div>
    )
  }

  const toggleModule = (mod: ModuleERP) => {
    setBrief(prev => {
      if (!prev) return prev
      const modules = prev.modules.includes(mod)
        ? prev.modules.filter(m => m !== mod)
        : [...prev.modules, mod]
      return { ...prev, modules }
    })
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Brief ERP Sur Mesure</h3>

      {/* Modules */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">Modules sélectionnés</label>
        <div className="space-y-1.5">
          {ALL_MODULES.map(mod => (
            <label key={mod} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={brief.modules.includes(mod)} onChange={() => toggleModule(mod)}
                className="rounded border-border text-primary" />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {MODULE_LABELS[mod]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Nb utilisateurs + Budget */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Nb utilisateurs</label>
          <input type="number" value={brief.nb_utilisateurs ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, nb_utilisateurs: parseInt(e.target.value) || null } : prev)}
            className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Budget estimé (€)</label>
          <input type="number" value={brief.budget ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, budget: parseFloat(e.target.value) || null } : prev)}
            className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
      </div>

      {/* Outils + URL */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Outils à intégrer</label>
          <input type="text" value={brief.outils_integres ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, outils_integres: e.target.value || null } : prev)}
            placeholder="Stripe, Shopify…" className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">URL déploiement</label>
          <input type="url" value={brief.url_deploiement ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, url_deploiement: e.target.value || null } : prev)}
            placeholder="https://…" className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
      </div>
    </div>
  )
}
