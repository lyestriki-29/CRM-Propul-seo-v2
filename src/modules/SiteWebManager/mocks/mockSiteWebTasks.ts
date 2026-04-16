import type { CommTask } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_SITEWEB_TASKS: CommTask[] = [
  { id: 'swt-001', title: 'Maquette page accueil', project_id: 'sw-001', project_name: 'Boulangerie Dupont', project_color: '#f59e0b', status: 'done', priority: 'critique', due_date: '2026-04-01', created_at: now, updated_at: now },
  { id: 'swt-002', title: 'Intégration responsive header', project_id: 'sw-002', project_name: 'Cabinet Legrand', project_color: '#3b82f6', status: 'in_progress', priority: 'haute', due_date: '2026-04-02', created_at: now, updated_at: now },
  { id: 'swt-003', title: 'SEO on-page balises meta', project_id: 'sw-003', project_name: 'Studio Deus', project_color: '#10b981', status: 'todo', priority: 'moyenne', due_date: '2026-04-03', created_at: now, updated_at: now },
  { id: 'swt-004', title: 'Tests cross-browser Chrome/Firefox/Safari', project_id: 'sw-001', project_name: 'Boulangerie Dupont', project_color: '#f59e0b', status: 'in_progress', priority: 'haute', due_date: '2026-04-07', created_at: now, updated_at: now },
  { id: 'swt-005', title: 'Formulaire de contact + validation', project_id: 'sw-002', project_name: 'Cabinet Legrand', project_color: '#3b82f6', status: 'todo', priority: 'critique', due_date: '2026-04-08', created_at: now, updated_at: now },
  { id: 'swt-006', title: 'Optimisation images WebP', project_id: 'sw-003', project_name: 'Studio Deus', project_color: '#10b981', status: 'done', priority: 'faible', due_date: '2026-04-04', created_at: now, updated_at: now },
  { id: 'swt-007', title: 'Maquette page services', project_id: 'sw-001', project_name: 'Boulangerie Dupont', project_color: '#f59e0b', status: 'in_progress', priority: 'critique', due_date: '2026-04-09', created_at: now, updated_at: now },
  { id: 'swt-008', title: 'Configuration Google Analytics', project_id: 'sw-002', project_name: 'Cabinet Legrand', project_color: '#3b82f6', status: 'todo', priority: 'moyenne', due_date: '2026-04-10', created_at: now, updated_at: now },
  { id: 'swt-009', title: 'Intégration carte Google Maps', project_id: 'sw-003', project_name: 'Studio Deus', project_color: '#10b981', status: 'in_progress', priority: 'haute', due_date: '2026-04-11', created_at: now, updated_at: now },
  { id: 'swt-010', title: 'Sitemap XML + robots.txt', project_id: 'sw-001', project_name: 'Boulangerie Dupont', project_color: '#f59e0b', status: 'todo', priority: 'faible', due_date: '2026-04-14', created_at: now, updated_at: now },
  { id: 'swt-011', title: 'Mise en ligne pré-prod', project_id: 'sw-002', project_name: 'Cabinet Legrand', project_color: '#3b82f6', status: 'todo', priority: 'critique', due_date: '2026-04-15', created_at: now, updated_at: now },
  { id: 'swt-012', title: 'Rédaction mentions légales + CGV', project_id: 'sw-003', project_name: 'Studio Deus', project_color: '#10b981', status: 'done', priority: 'moyenne', due_date: '2026-04-05', created_at: now, updated_at: now },
  { id: 'swt-013', title: 'Test performance Lighthouse', project_id: 'sw-001', project_name: 'Boulangerie Dupont', project_color: '#f59e0b', status: 'todo', priority: 'haute', due_date: '2026-04-18', created_at: now, updated_at: now },
  { id: 'swt-014', title: 'Intégration responsive footer + mobile', project_id: 'sw-002', project_name: 'Cabinet Legrand', project_color: '#3b82f6', status: 'in_progress', priority: 'moyenne', due_date: '2026-04-21', created_at: now, updated_at: now },
  { id: 'swt-015', title: 'Redirection 301 ancien site', project_id: 'sw-003', project_name: 'Studio Deus', project_color: '#10b981', status: 'todo', priority: 'haute', due_date: '2026-04-25', created_at: now, updated_at: now },
]
