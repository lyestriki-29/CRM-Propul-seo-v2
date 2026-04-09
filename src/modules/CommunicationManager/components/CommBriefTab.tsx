import React, { useState } from 'react'
import type { BriefComm, TypeContratComm, PackComm, PlateformeComm } from '../../../types/project-v2'
import { MOCK_COMM_BRIEFS } from '../mocks'

const PACK_CONFIG: Record<PackComm, { label: string; posts: number; reels: number; templates: number; mrr: number }> = {
  starter:    { label: 'Starter — 600€/mois',    posts: 6,  reels: 0, templates: 0, mrr: 600 },
  premium:    { label: 'Premium — 900€/mois',     posts: 8,  reels: 1, templates: 2, mrr: 900 },
  excellence: { label: 'Excellence — 1400€/mois', posts: 12, reels: 2, templates: 4, mrr: 1400 },
}

interface Props { projectId: string }

export function CommBriefTab({ projectId }: Props) {
  const initial = MOCK_COMM_BRIEFS.find(b => b.project_id === projectId) ?? null
  const [brief, setBrief] = useState<BriefComm | null>(initial)

  if (!brief) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Aucun brief —{' '}
        <button
          className="text-primary underline"
          onClick={() => {
            const now = new Date().toISOString()
            setBrief({
              id: `commb-${Date.now()}`,
              project_id: projectId,
              status: 'draft',
              type_contrat: 'abonnement',
              pack: null,
              nb_posts_mois: null,
              nb_reels_mois: null,
              nb_templates: null,
              plateforme: null,
              date_debut: null,
              date_renouvellement: null,
              mrr: null,
              budget: null,
              date_livraison: null,
              created_at: now,
              updated_at: now,
            })
          }}
        >
          Créer le brief
        </button>
      </div>
    )
  }

  const handleContratChange = (type: TypeContratComm) => {
    setBrief(prev => prev ? {
      ...prev,
      type_contrat: type,
      pack: null,
      nb_posts_mois: null,
      nb_reels_mois: null,
      nb_templates: null,
      mrr: null,
      budget: type !== 'abonnement' ? 1500 : null,
    } : prev)
  }

  const handlePackChange = (pack: PackComm) => {
    const cfg = PACK_CONFIG[pack]
    setBrief(prev => prev ? {
      ...prev,
      pack,
      nb_posts_mois: cfg.posts,
      nb_reels_mois: cfg.reels,
      nb_templates: cfg.templates,
      mrr: cfg.mrr,
    } : prev)
  }

  const TYPE_LABELS: Record<TypeContratComm, string> = {
    abonnement: 'Abonnement Instagram',
    branding: 'Branding',
    photos_videos: 'Photos & Vidéos',
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Brief Communication</h3>

      {/* Type de contrat */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Type de contrat</label>
        <div className="flex flex-col gap-1.5">
          {(['abonnement', 'branding', 'photos_videos'] as TypeContratComm[]).map(type => (
            <button
              key={type}
              onClick={() => handleContratChange(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors text-left ${
                brief.type_contrat === type
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-surface-2 border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Abonnement : pack + détails */}
      {brief.type_contrat === 'abonnement' && (
        <>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Pack</label>
            <div className="flex flex-col gap-1.5">
              {(Object.keys(PACK_CONFIG) as PackComm[]).map(pack => (
                <button
                  key={pack}
                  onClick={() => handlePackChange(pack)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors text-left ${
                    brief.pack === pack
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-surface-2 border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {PACK_CONFIG[pack].label}
                </button>
              ))}
            </div>
          </div>

          {brief.pack && (
            <div className="grid grid-cols-3 gap-2 bg-surface-2 rounded-lg p-3 text-xs">
              <div>
                <span className="text-muted-foreground block">Posts/mois</span>
                <p className="font-semibold text-foreground">{brief.nb_posts_mois}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">Réels/mois</span>
                <p className="font-semibold text-foreground">{brief.nb_reels_mois}</p>
              </div>
              <div>
                <span className="text-muted-foreground block">MRR</span>
                <p className="font-semibold text-primary">{brief.mrr}€</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Plateforme</label>
              <select
                value={brief.plateforme ?? ''}
                onChange={e => setBrief(prev => prev ? { ...prev, plateforme: (e.target.value || null) as PlateformeComm | null } : prev)}
                className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground"
              >
                <option value="">Sélectionner</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="multi">Multi-plateformes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Date début</label>
              <input
                type="date"
                value={brief.date_debut ?? ''}
                onChange={e => setBrief(prev => prev ? { ...prev, date_debut: e.target.value || null } : prev)}
                className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground"
              />
            </div>
          </div>
        </>
      )}

      {/* One-shot : budget + date livraison */}
      {brief.type_contrat !== 'abonnement' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Budget (€)</label>
            <input
              type="number"
              value={brief.budget ?? ''}
              onChange={e => setBrief(prev => prev ? { ...prev, budget: parseFloat(e.target.value) || null } : prev)}
              className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Date livraison</label>
            <input
              type="date"
              value={brief.date_livraison ?? ''}
              onChange={e => setBrief(prev => prev ? { ...prev, date_livraison: e.target.value || null } : prev)}
              className="w-full p-2 text-sm border border-border rounded-md bg-surface-2 text-foreground"
            />
          </div>
        </div>
      )}
    </div>
  )
}
