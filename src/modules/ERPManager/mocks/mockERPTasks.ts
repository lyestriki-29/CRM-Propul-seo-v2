import type { CommTask } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_ERP_TASKS: CommTask[] = [
  { id: 'et-001', title: 'Sprint planning S16',               project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'done',        priority: 'haute',    due_date: '2026-04-01', created_at: now, updated_at: now },
  { id: 'et-002', title: 'Module gestion mandats',            project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'in_progress', priority: 'critique', due_date: '2026-04-03', created_at: now, updated_at: now },
  { id: 'et-003', title: 'API REST transactions',             project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'in_progress', priority: 'haute',    due_date: '2026-04-07', created_at: now, updated_at: now },
  { id: 'et-004', title: 'Tests unitaires mandats',           project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'todo',        priority: 'moyenne',  due_date: '2026-04-10', created_at: now, updated_at: now },
  { id: 'et-005', title: 'Pipeline transactions UI',          project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'todo',        priority: 'haute',    due_date: '2026-04-14', created_at: now, updated_at: now },
  { id: 'et-006', title: 'Module commissions agents',         project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'todo',        priority: 'critique', due_date: '2026-04-18', created_at: now, updated_at: now },
  { id: 'et-007', title: 'Audit besoins Clinique Morin',      project_id: 'erp-002', project_name: 'ERP Clinique Morin', project_color: '#8b5cf6', status: 'done',        priority: 'critique', due_date: '2026-04-02', created_at: now, updated_at: now },
  { id: 'et-008', title: 'Spec technique planning soins',     project_id: 'erp-002', project_name: 'ERP Clinique Morin', project_color: '#8b5cf6', status: 'in_progress', priority: 'haute',    due_date: '2026-04-08', created_at: now, updated_at: now },
  { id: 'et-009', title: 'Estimation chiffrage V1',           project_id: 'erp-002', project_name: 'ERP Clinique Morin', project_color: '#8b5cf6', status: 'in_progress', priority: 'moyenne',  due_date: '2026-04-09', created_at: now, updated_at: now },
  { id: 'et-010', title: 'Proposition commerciale',           project_id: 'erp-002', project_name: 'ERP Clinique Morin', project_color: '#8b5cf6', status: 'todo',        priority: 'haute',    due_date: '2026-04-15', created_at: now, updated_at: now },
  { id: 'et-011', title: 'Migration BDD legacy',              project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'todo',        priority: 'critique', due_date: '2026-04-21', created_at: now, updated_at: now },
  { id: 'et-012', title: 'Deploiement staging',               project_id: 'erp-001', project_name: 'ERP Immo Horizon',  project_color: '#f59e0b', status: 'todo',        priority: 'faible',   due_date: '2026-04-25', created_at: now, updated_at: now },
]
