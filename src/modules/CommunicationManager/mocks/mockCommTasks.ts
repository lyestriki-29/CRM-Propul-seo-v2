import type { CommTask } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_COMM_TASKS: CommTask[] = [
  { id: 'ct-001', title: 'Reel Instagram Docadoca', project_id: 'comm-003', project_name: 'Docadoca', project_color: '#818cf8', status: 'in_progress', priority: 'critique', due_date: '2026-04-01', created_at: now, updated_at: now },
  { id: 'ct-002', title: 'Post LinkedIn La Clé', project_id: 'comm-004', project_name: 'La Clé', project_color: '#f87171', status: 'done', priority: 'haute', due_date: '2026-04-03', created_at: now, updated_at: now },
  { id: 'ct-003', title: 'Story Locagame x3', project_id: 'comm-005', project_name: 'Locagame', project_color: '#34d399', status: 'done', priority: 'moyenne', due_date: '2026-04-04', created_at: now, updated_at: now },
  { id: 'ct-004', title: 'Shooting produit Murmure', project_id: 'comm-001', project_name: 'Murmure', project_color: '#e879f9', status: 'in_progress', priority: 'critique', due_date: '2026-04-07', created_at: now, updated_at: now },
  { id: 'ct-005', title: 'Mise à jour bio Instagram', project_id: 'comm-003', project_name: 'Docadoca', project_color: '#818cf8', status: 'todo', priority: 'faible', due_date: '2026-04-07', created_at: now, updated_at: now },
  { id: 'ct-006', title: 'Carousel LinkedIn V2', project_id: 'comm-004', project_name: 'La Clé', project_color: '#f87171', status: 'in_progress', priority: 'haute', due_date: '2026-04-08', created_at: now, updated_at: now },
  { id: 'ct-007', title: 'Brief rédac Etienne', project_id: 'comm-006', project_name: 'Etienne Perso', project_color: '#38bdf8', status: 'in_progress', priority: 'critique', due_date: '2026-04-09', created_at: now, updated_at: now },
  { id: 'ct-008', title: 'Caption x5 semaine', project_id: 'comm-005', project_name: 'Locagame', project_color: '#34d399', status: 'in_progress', priority: 'moyenne', due_date: '2026-04-09', created_at: now, updated_at: now },
  { id: 'ct-009', title: 'Newsletter Avril', project_id: 'comm-005', project_name: 'Locagame', project_color: '#34d399', status: 'in_progress', priority: 'haute', due_date: '2026-04-10', created_at: now, updated_at: now },
  { id: 'ct-010', title: 'Reel viral Etienne', project_id: 'comm-006', project_name: 'Etienne Perso', project_color: '#38bdf8', status: 'todo', priority: 'critique', due_date: '2026-04-14', created_at: now, updated_at: now },
  { id: 'ct-011', title: 'Post promo La Clé', project_id: 'comm-004', project_name: 'La Clé', project_color: '#f87171', status: 'todo', priority: 'haute', due_date: '2026-04-15', created_at: now, updated_at: now },
  { id: 'ct-012', title: 'Audit IG Murmure', project_id: 'comm-001', project_name: 'Murmure', project_color: '#e879f9', status: 'todo', priority: 'faible', due_date: '2026-04-15', created_at: now, updated_at: now },
  { id: 'ct-013', title: 'Livraison pack Mai Locagame', project_id: 'comm-005', project_name: 'Locagame', project_color: '#34d399', status: 'todo', priority: 'critique', due_date: '2026-04-18', created_at: now, updated_at: now },
  { id: 'ct-014', title: 'Reel x2 Murmure', project_id: 'comm-001', project_name: 'Murmure', project_color: '#e879f9', status: 'todo', priority: 'haute', due_date: '2026-04-21', created_at: now, updated_at: now },
  { id: 'ct-015', title: 'Brief visuel Juin', project_id: 'comm-003', project_name: 'Docadoca', project_color: '#818cf8', status: 'todo', priority: 'haute', due_date: '2026-04-25', created_at: now, updated_at: now },
]
