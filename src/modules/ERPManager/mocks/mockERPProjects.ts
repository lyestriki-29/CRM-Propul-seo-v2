import type { ProjectV2 } from '../../../types/project-v2'
import type { StatusERP } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_ERP_PROJECTS: (ProjectV2 & { erp_status: StatusERP })[] = [
  {
    id: 'erp-001', user_id: null, client_id: null,
    client_name: 'Agence Immo Horizon',
    name: 'ERP gestion mandats immobiliers',
    description: 'CRM + pipeline transactions + commissions',
    status: 'in_progress', priority: 'urgent',
    assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
    start_date: '2026-02-15', end_date: '2026-06-30',
    budget: 12000, progress: 40, category: 'erp_v2',
    presta_type: ['erp_v2'], completion_score: 40,
    last_activity_at: now, completed_at: null,
    is_archived: false, next_action_label: 'Sprint 2 — features avancées',
    next_action_due: '2026-04-15', siret: null,
    company_data: null, company_enriched_at: null,
    ai_summary: null, ai_summary_generated_at: null,
    portal_token: null, portal_enabled: false,
    created_at: now, updated_at: now,
    erp_status: 'en_developpement',
  },
  {
    id: 'erp-002', user_id: null, client_id: null,
    client_name: 'Clinique Vétérinaire Morin',
    name: 'ERP gestion clinique vétérinaire',
    description: 'Gestion RDV + stocks + facturation',
    status: 'prospect', priority: 'medium',
    assigned_to: 'user-alice', assigned_name: 'Alice Martin',
    start_date: '2026-04-01', end_date: null,
    budget: null, progress: 0, category: 'erp_v2',
    presta_type: ['erp_v2'], completion_score: 0,
    last_activity_at: now, completed_at: null,
    is_archived: false, next_action_label: 'Audit besoins',
    next_action_due: '2026-04-12', siret: null,
    company_data: null, company_enriched_at: null,
    ai_summary: null, ai_summary_generated_at: null,
    portal_token: null, portal_enabled: false,
    created_at: now, updated_at: now,
    erp_status: 'prospect',
  },
]
