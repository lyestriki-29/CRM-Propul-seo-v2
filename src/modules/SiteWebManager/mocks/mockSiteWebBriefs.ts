import type { BriefSiteWeb } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_SITEWEB_BRIEFS: Record<string, BriefSiteWeb> = {
  'sw-001': {
    id: 'swb-001', project_id: 'sw-001', status: 'validated',
    pack: 'professionnel', nb_pages: 5, budget: 1980,
    niveau_seo: 'avance', url_site: null,
    plateforme: 'WordPress',
    created_at: now, updated_at: now,
  },
  'sw-002': {
    id: 'swb-002', project_id: 'sw-002', status: 'draft',
    pack: 'entreprise', nb_pages: 10, budget: 2980,
    niveau_seo: 'premium', url_site: null,
    plateforme: null,
    created_at: now, updated_at: now,
  },
  'sw-003': {
    id: 'swb-003', project_id: 'sw-003', status: 'frozen',
    pack: 'starter', nb_pages: 1, budget: 1480,
    niveau_seo: 'basique', url_site: 'https://studio-deus.fr',
    plateforme: 'Webflow',
    created_at: now, updated_at: now,
  },
}
