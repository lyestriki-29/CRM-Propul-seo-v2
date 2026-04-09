import type { BriefERP } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_ERP_BRIEFS: Record<string, BriefERP> = {
  'erp-001': {
    id: 'erpb-001', project_id: 'erp-001', status: 'frozen',
    modules: ['crm_suivi', 'gestion_projets', 'suivi_financier', 'multi_utilisateurs', 'tableaux_bord'],
    nb_utilisateurs: 10, budget: 12000,
    outils_integres: 'Stripe, DocuSign',
    url_deploiement: null,
    created_at: now, updated_at: now,
  },
  'erp-002': {
    id: 'erpb-002', project_id: 'erp-002', status: 'draft',
    modules: [], nb_utilisateurs: null, budget: null,
    outils_integres: null, url_deploiement: null,
    created_at: now, updated_at: now,
  },
}
