import type { ChecklistItemV2 } from '../../../types/project-v2'

const now = new Date().toISOString()
const d = (daysOffset: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + daysOffset)
  return dt.toISOString().split('T')[0]
}

export const MOCK_CHECKLISTS: Record<string, ChecklistItemV2[]> = {
  'proj-004': [
    {
      id: 'ck-001', project_id: 'proj-004', parent_task_id: null,
      title: 'Brief initial validé', phase: 'onboarding', status: 'done',
      priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit',
      due_date: d(-18), sort_order: 1, created_at: now, updated_at: now,
    },
    {
      id: 'ck-002', project_id: 'proj-004', parent_task_id: null,
      title: 'Accès récupérés (hébergement, domaine, analytics)', phase: 'onboarding', status: 'done',
      priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit',
      due_date: d(-17), sort_order: 2, created_at: now, updated_at: now,
    },
    {
      id: 'ck-003', project_id: 'proj-004', parent_task_id: null,
      title: 'Contenu reçu du client', phase: 'onboarding', status: 'done',
      priority: 'medium', assigned_to: 'user-carol', assigned_name: 'Carol Petit',
      due_date: d(-16), sort_order: 3, created_at: now, updated_at: now,
    },
    {
      id: 'ck-004', project_id: 'proj-004', parent_task_id: null,
      title: 'Maquettes desktop livrées', phase: 'conception', status: 'done',
      priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin',
      due_date: d(-12), sort_order: 4, created_at: now, updated_at: now,
    },
    {
      id: 'ck-005', project_id: 'proj-004', parent_task_id: null,
      title: 'Maquettes mobile livrées', phase: 'conception', status: 'done',
      priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin',
      due_date: d(-10), sort_order: 5, created_at: now, updated_at: now,
    },
    {
      id: 'ck-006', project_id: 'proj-004', parent_task_id: null,
      title: 'Validation client des maquettes', phase: 'conception', status: 'done',
      priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit',
      due_date: d(-8), sort_order: 6, created_at: now, updated_at: now,
    },
    {
      id: 'ck-007', project_id: 'proj-004', parent_task_id: null,
      title: 'Intégration des pages principales', phase: 'developpement', status: 'in_progress',
      priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit',
      due_date: d(2), sort_order: 7, created_at: now, updated_at: now,
    },
    {
      id: 'ck-008', project_id: 'proj-004', parent_task_id: null,
      title: 'Optimisation SEO on-page', phase: 'developpement', status: 'in_progress',
      priority: 'medium', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
      due_date: d(5), sort_order: 8, created_at: now, updated_at: now,
    },
    {
      id: 'ck-009', project_id: 'proj-004', parent_task_id: null,
      title: 'Tests cross-browser et responsive', phase: 'developpement', status: 'todo',
      priority: 'medium', assigned_to: null, assigned_name: null,
      due_date: d(8), sort_order: 9, created_at: now, updated_at: now,
    },
    {
      id: 'ck-010', project_id: 'proj-004', parent_task_id: null,
      title: 'Recette interne effectuée', phase: 'recette', status: 'todo',
      priority: 'high', assigned_to: null, assigned_name: null,
      due_date: d(10), sort_order: 10, created_at: now, updated_at: now,
    },
    {
      id: 'ck-011', project_id: 'proj-004', parent_task_id: null,
      title: 'Recette client effectuée', phase: 'recette', status: 'todo',
      priority: 'high', assigned_to: null, assigned_name: null,
      due_date: d(12), sort_order: 11, created_at: now, updated_at: now,
    },
  ],
  'proj-005': [
    {
      id: 'ck-101', project_id: 'proj-005', parent_task_id: null,
      title: 'Brief fonctionnel validé', phase: 'onboarding', status: 'done',
      priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
      due_date: d(-28), sort_order: 1, created_at: now, updated_at: now,
    },
    {
      id: 'ck-102', project_id: 'proj-005', parent_task_id: null,
      title: 'Cahier des charges rédigé et validé', phase: 'onboarding', status: 'done',
      priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
      due_date: d(-25), sort_order: 2, created_at: now, updated_at: now,
    },
    {
      id: 'ck-103', project_id: 'proj-005', parent_task_id: null,
      title: 'Architecture technique définie', phase: 'onboarding', status: 'done',
      priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
      due_date: d(-22), sort_order: 3, created_at: now, updated_at: now,
    },
    {
      id: 'ck-104', project_id: 'proj-005', parent_task_id: null,
      title: 'Sprint 1 : MVP livré', phase: 'developpement', status: 'done',
      priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
      due_date: d(-15), sort_order: 4, created_at: now, updated_at: now,
    },
    {
      id: 'ck-105', project_id: 'proj-005', parent_task_id: null,
      title: 'Sprint 2 : features avancées', phase: 'developpement', status: 'in_progress',
      priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
      due_date: d(3), sort_order: 5, created_at: now, updated_at: now,
    },
    {
      id: 'ck-106', project_id: 'proj-005', parent_task_id: null,
      title: 'Tests unitaires et d\'intégration', phase: 'developpement', status: 'in_progress',
      priority: 'medium', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre',
      due_date: d(5), sort_order: 6, created_at: now, updated_at: now,
    },
    {
      id: 'ck-107', project_id: 'proj-005', parent_task_id: null,
      title: 'Recette fonctionnelle complète', phase: 'recette', status: 'todo',
      priority: 'high', assigned_to: null, assigned_name: null,
      due_date: d(7), sort_order: 7, created_at: now, updated_at: now,
    },
  ],
}
