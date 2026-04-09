import type { ChecklistItemV2 } from '../../../types/project-v2'

const now = new Date().toISOString()

export const COMM_CHECKLIST_INSTAGRAM: Omit<ChecklistItemV2, 'id' | 'project_id' | 'created_at' | 'updated_at'>[] = [
  { parent_task_id: null, title: 'Brief mensuel reçu', phase: 'onboarding', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 1 },
  { parent_task_id: null, title: 'Calendrier éditorial validé', phase: 'conception', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 2 },
  { parent_task_id: null, title: 'Visuels créés', phase: 'developpement', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 3 },
  { parent_task_id: null, title: 'Textes rédigés', phase: 'developpement', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 4 },
  { parent_task_id: null, title: 'Validation client', phase: 'recette', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 5 },
  { parent_task_id: null, title: 'Programmation des posts', phase: 'post_livraison', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 6 },
  { parent_task_id: null, title: 'Rapport de performance envoyé', phase: 'post_livraison', status: 'todo', priority: 'medium', assigned_to: null, assigned_name: null, due_date: null, sort_order: 7 },
]

export const COMM_CHECKLIST_BRANDING: Omit<ChecklistItemV2, 'id' | 'project_id' | 'created_at' | 'updated_at'>[] = [
  { parent_task_id: null, title: 'Brief identité reçu', phase: 'onboarding', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 1 },
  { parent_task_id: null, title: 'Propositions logo x3', phase: 'conception', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 2 },
  { parent_task_id: null, title: 'Logo validé client', phase: 'conception', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 3 },
  { parent_task_id: null, title: 'Charte graphique (couleurs, typographies)', phase: 'developpement', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 4 },
  { parent_task_id: null, title: 'Déclinaisons livrées', phase: 'post_livraison', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 5 },
  { parent_task_id: null, title: 'Livraison fichiers sources', phase: 'post_livraison', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 6 },
]

export const COMM_CHECKLIST_PHOTOS: Omit<ChecklistItemV2, 'id' | 'project_id' | 'created_at' | 'updated_at'>[] = [
  { parent_task_id: null, title: 'Brief tournage reçu', phase: 'onboarding', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 1 },
  { parent_task_id: null, title: 'Date tournage confirmée', phase: 'onboarding', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 2 },
  { parent_task_id: null, title: 'Tournage réalisé', phase: 'developpement', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 3 },
  { parent_task_id: null, title: 'Sélection photos/vidéos', phase: 'developpement', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 4 },
  { parent_task_id: null, title: 'Retouches', phase: 'recette', status: 'todo', priority: 'medium', assigned_to: null, assigned_name: null, due_date: null, sort_order: 5 },
  { parent_task_id: null, title: 'Livraison base média client', phase: 'post_livraison', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: null, sort_order: 6 },
]
