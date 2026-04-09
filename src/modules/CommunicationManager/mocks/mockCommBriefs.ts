import type { BriefComm } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_COMM_BRIEFS: BriefComm[] = [
  {
    id: 'commb-001', project_id: 'comm-001', status: 'validated',
    type_contrat: 'abonnement', pack: 'excellence',
    nb_posts_mois: 12, nb_reels_mois: 2, nb_templates: 4,
    plateforme: 'instagram', date_debut: '2026-01-01',
    date_renouvellement: '2026-05-01', mrr: 1400,
    budget: null, date_livraison: null,
    created_at: now, updated_at: now,
  },
  {
    id: 'commb-002', project_id: 'comm-002', status: 'validated',
    type_contrat: 'branding', pack: null,
    nb_posts_mois: null, nb_reels_mois: null, nb_templates: null,
    plateforme: null, date_debut: '2026-03-20',
    date_renouvellement: null, mrr: null,
    budget: 1500, date_livraison: '2026-04-20',
    created_at: now, updated_at: now,
  },
  {
    id: 'commb-003', project_id: 'comm-003', status: 'draft',
    type_contrat: 'abonnement', pack: 'premium',
    nb_posts_mois: 8, nb_reels_mois: 1, nb_templates: 2,
    plateforme: 'instagram', date_debut: null,
    date_renouvellement: null, mrr: 900,
    budget: null, date_livraison: null,
    created_at: now, updated_at: now,
  },
]
