import React, { useState } from 'react'
import type { BriefSiteWeb, PackSiteWeb, NiveauSEO } from '../../../types/project-v2'
import { MOCK_SITEWEB_BRIEFS } from '../mocks'

const PACK_LABELS: Record<PackSiteWeb, string> = {
  starter: 'Starter — 1 480€',
  professionnel: 'Professionnel — 1 980€',
  entreprise: 'Entreprise — 2 980€',
  sur_mesure: 'Sur mesure — Devis',
}

const PACK_PAGES: Record<PackSiteWeb, number | null> = {
  starter: 1, professionnel: 5, entreprise: 10, sur_mesure: null,
}

const PACK_BUDGET: Record<PackSiteWeb, number | null> = {
  starter: 1480, professionnel: 1980, entreprise: 2980, sur_mesure: null,
}

const SEO_LABELS: Record<NiveauSEO, string> = {
  basique: 'Basique', avance: 'Avancé', premium: 'Premium',
}

interface Props { projectId: string }

export function SiteWebBriefTab({ projectId }: Props) {
  const initial = MOCK_SITEWEB_BRIEFS[projectId] ?? null
  const [brief, setBrief] = useState<BriefSiteWeb | null>(initial)

  if (!brief) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Aucun brief — <button className="text-primary underline" onClick={() => {
          const now = new Date().toISOString()
          setBrief({ id: `swb-${Date.now()}`, project_id: projectId, status: 'draft', pack: 'starter', nb_pages: 1, budget: 1480, niveau_seo: 'basique', url_site: null, plateforme: null, created_at: now, updated_at: now })
        }}>Créer le brief</button>
      </div>
    )
  }

  const handlePackChange = (pack: PackSiteWeb) => {
    setBrief(prev => prev ? { ...prev, pack, nb_pages: PACK_PAGES[pack], budget: PACK_BUDGET[pack] } : prev)
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Brief Site Web & SEO</h3>

      {/* Pack */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Pack</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PACK_LABELS) as PackSiteWeb[]).map(pack => (
            <button key={pack} onClick={() => handlePackChange(pack)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                brief.pack === pack
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-surface-2 border-border text-muted-foreground hover:border-primary/50'
              }`}>
              {PACK_LABELS[pack]}
            </button>
          ))}
        </div>
      </div>

      {/* Nb pages + Budget (auto) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Nb pages</label>
          <input type="number" value={brief.nb_pages ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, nb_pages: parseInt(e.target.value) || null } : prev)}
            className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Budget (€)</label>
          <input type="number" value={brief.budget ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, budget: parseFloat(e.target.value) || null } : prev)}
            className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
      </div>

      {/* Niveau SEO */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Niveau SEO</label>
        <div className="flex gap-2">
          {(Object.keys(SEO_LABELS) as NiveauSEO[]).map(lvl => (
            <button key={lvl} onClick={() => setBrief(prev => prev ? { ...prev, niveau_seo: lvl } : prev)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                brief.niveau_seo === lvl
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-surface-2 border-border text-muted-foreground hover:border-primary/50'
              }`}>
              {SEO_LABELS[lvl]}
            </button>
          ))}
        </div>
      </div>

      {/* URL site + Plateforme */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">URL site final</label>
          <input type="url" value={brief.url_site ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, url_site: e.target.value || null } : prev)}
            placeholder="https://..." className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Plateforme</label>
          <input type="text" value={brief.plateforme ?? ''} onChange={e => setBrief(prev => prev ? { ...prev, plateforme: e.target.value || null } : prev)}
            placeholder="WordPress, Webflow…" className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground" />
        </div>
      </div>
    </div>
  )
}
