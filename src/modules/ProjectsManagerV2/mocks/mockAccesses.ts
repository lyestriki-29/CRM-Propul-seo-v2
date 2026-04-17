import type { AccessCategory, AccessStatus } from '../../../types/project-v2'

export interface MockAccess {
  id: string
  project_id: string
  category: AccessCategory
  label: string
  url?: string | null
  login?: string | null
  password?: string | null
  notes?: string | null
  status: AccessStatus
  provided_by?: string | null
  expires_at?: string | null
  created_at: string
  updated_at: string
}

const now = new Date().toISOString()

export const MOCK_ACCESSES: Record<string, MockAccess[]> = {
  'proj-test-siteweb': [
    { id: 'acc-sw-1', project_id: 'proj-test-siteweb', category: 'hosting', label: 'OVH Hébergement', url: 'https://ovh.com', login: 'dupont-hosting', password: '***', status: 'active', provided_by: 'M. Dupont', expires_at: null, notes: null, created_at: now, updated_at: now },
    { id: 'acc-sw-2', project_id: 'proj-test-siteweb', category: 'cms', label: 'WordPress Admin', url: 'https://boulangerie-dupont.fr/wp-admin', login: 'admin', password: '***', status: 'active', provided_by: 'M. Dupont', expires_at: null, notes: null, created_at: now, updated_at: now },
    { id: 'acc-sw-3', project_id: 'proj-test-siteweb', category: 'analytics', label: 'Google Analytics', url: 'https://analytics.google.com', login: 'dupont@gmail.com', password: '***', status: 'active', provided_by: 'M. Dupont', expires_at: null, notes: null, created_at: now, updated_at: now },
    { id: 'acc-sw-4', project_id: 'proj-test-siteweb', category: 'tools', label: 'Google Ads', url: null, login: null, password: null, status: 'missing', provided_by: null, expires_at: null, notes: 'En attente des accès client', created_at: now, updated_at: now },
    { id: 'acc-sw-5', project_id: 'proj-test-siteweb', category: 'design', label: 'Canva Pro', url: 'https://canva.com', login: 'propulseo@canva.com', password: '***', status: 'active', provided_by: 'Interne', expires_at: null, notes: null, created_at: now, updated_at: now },
  ],
  'proj-test-erp': [
    { id: 'acc-erp-1', project_id: 'proj-test-erp', category: 'hosting', label: 'Serveur dédié OVH', url: 'https://ovh.com', login: 'root', password: '***', status: 'active', provided_by: 'TransportPro', expires_at: null, notes: 'IP: 91.134.xxx.xxx', created_at: now, updated_at: now },
    { id: 'acc-erp-2', project_id: 'proj-test-erp', category: 'tools', label: 'API Chronopost', url: 'https://api.chronopost.fr', login: 'transportpro-api', password: '***', status: 'active', provided_by: 'TransportPro', expires_at: '2027-01-01', notes: null, created_at: now, updated_at: now },
    { id: 'acc-erp-3', project_id: 'proj-test-erp', category: 'tools', label: 'API DHL', url: null, login: null, password: null, status: 'missing', provided_by: null, expires_at: null, notes: 'Demandé au client le 12/03', created_at: now, updated_at: now },
    { id: 'acc-erp-4', project_id: 'proj-test-erp', category: 'analytics', label: 'Google Workspace', url: 'https://admin.google.com', login: 'admin@transportpro.fr', password: '***', status: 'active', provided_by: 'TransportPro', expires_at: null, notes: 'Pour SSO', created_at: now, updated_at: now },
  ],
  'proj-test-comm': [
    { id: 'acc-cm-1', project_id: 'proj-test-comm', category: 'social', label: 'Instagram Business', url: 'https://instagram.com/lesrecoltants', login: 'lesrecoltants', password: '***', status: 'active', provided_by: 'Les Récoltants', expires_at: null, notes: null, created_at: now, updated_at: now },
    { id: 'acc-cm-2', project_id: 'proj-test-comm', category: 'social', label: 'LinkedIn Page', url: 'https://linkedin.com/company/les-recoltants', login: 'contact@lesrecoltants.fr', password: '***', status: 'active', provided_by: 'Les Récoltants', expires_at: null, notes: null, created_at: now, updated_at: now },
    { id: 'acc-cm-3', project_id: 'proj-test-comm', category: 'design', label: 'Canva Pro', url: 'https://canva.com', login: 'propulseo@canva.com', password: '***', status: 'active', provided_by: 'Interne', expires_at: null, notes: null, created_at: now, updated_at: now },
    { id: 'acc-cm-4', project_id: 'proj-test-comm', category: 'analytics', label: 'Google Analytics', url: null, login: null, password: null, status: 'pending_validation', provided_by: null, expires_at: null, notes: 'En attente validation client', created_at: now, updated_at: now },
    { id: 'acc-cm-5', project_id: 'proj-test-comm', category: 'tools', label: 'Later (scheduling)', url: 'https://later.com', login: 'propulseo', password: '***', status: 'active', provided_by: 'Interne', expires_at: null, notes: null, created_at: now, updated_at: now },
  ],
}
