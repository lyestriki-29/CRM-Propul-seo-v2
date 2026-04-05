import type { ChecklistItemV2 } from '../../../types/project-v2'

const now = new Date().toISOString()
const d = (daysOffset: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + daysOffset)
  return dt.toISOString().split('T')[0]
}

export const MOCK_CHECKLISTS: Record<string, ChecklistItemV2[]> = {
  'proj-001': [
    { id: 'ck-001a', project_id: 'proj-001', parent_task_id: null, title: 'Prise de contact initiale', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-1), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-001b', project_id: 'proj-001', parent_task_id: null, title: 'Brief client à remplir', phase: 'onboarding', status: 'in_progress', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(3), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-001c', project_id: 'proj-001', parent_task_id: null, title: 'Devis à envoyer', phase: 'onboarding', status: 'todo', priority: 'medium', assigned_to: null, assigned_name: null, due_date: d(7), sort_order: 3, created_at: now, updated_at: now },
  ],
  'proj-002': [
    { id: 'ck-002a', project_id: 'proj-002', parent_task_id: null, title: 'Audit SEO initial (mots-clés, concurrents)', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-4), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-002b', project_id: 'proj-002', parent_task_id: null, title: 'Validation stratégie mots-clés', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-2), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-002c', project_id: 'proj-002', parent_task_id: null, title: 'Optimisation on-page (title, meta, H1)', phase: 'developpement', status: 'in_progress', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(5), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-002d', project_id: 'proj-002', parent_task_id: null, title: 'Création de 4 articles SEO', phase: 'developpement', status: 'todo', priority: 'medium', assigned_to: null, assigned_name: null, due_date: d(15), sort_order: 4, created_at: now, updated_at: now },
    { id: 'ck-002e', project_id: 'proj-002', parent_task_id: null, title: 'Netlinking — 10 backlinks de qualité', phase: 'post_livraison', status: 'todo', priority: 'medium', assigned_to: null, assigned_name: null, due_date: d(25), sort_order: 5, created_at: now, updated_at: now },
  ],
  'proj-003': [
    { id: 'ck-003a', project_id: 'proj-003', parent_task_id: null, title: 'Cahier des charges fonctionnel', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-5), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-003b', project_id: 'proj-003', parent_task_id: null, title: 'Validation devis & signature contrat', phase: 'onboarding', status: 'in_progress', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(2), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-003c', project_id: 'proj-003', parent_task_id: null, title: 'Choix stack technique', phase: 'conception', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: d(12), sort_order: 3, created_at: now, updated_at: now },
  ],
  'proj-004': [
    { id: 'ck-001', project_id: 'proj-004', parent_task_id: null, title: 'Brief initial validé', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-18), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-002', project_id: 'proj-004', parent_task_id: null, title: 'Accès récupérés (hébergement, domaine, analytics)', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-17), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-003', project_id: 'proj-004', parent_task_id: null, title: 'Contenu reçu du client', phase: 'onboarding', status: 'done', priority: 'medium', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-16), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-004', project_id: 'proj-004', parent_task_id: null, title: 'Maquettes desktop livrées', phase: 'conception', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-12), sort_order: 4, created_at: now, updated_at: now },
    { id: 'ck-005', project_id: 'proj-004', parent_task_id: null, title: 'Maquettes mobile livrées', phase: 'conception', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-10), sort_order: 5, created_at: now, updated_at: now },
    { id: 'ck-006', project_id: 'proj-004', parent_task_id: null, title: 'Validation client des maquettes', phase: 'conception', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-8), sort_order: 6, created_at: now, updated_at: now },
    { id: 'ck-007', project_id: 'proj-004', parent_task_id: null, title: 'Intégration des pages principales', phase: 'developpement', status: 'in_progress', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(2), sort_order: 7, created_at: now, updated_at: now },
    { id: 'ck-008', project_id: 'proj-004', parent_task_id: null, title: 'Optimisation SEO on-page', phase: 'developpement', status: 'in_progress', priority: 'medium', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(5), sort_order: 8, created_at: now, updated_at: now },
    { id: 'ck-009', project_id: 'proj-004', parent_task_id: null, title: 'Tests cross-browser et responsive', phase: 'developpement', status: 'todo', priority: 'medium', assigned_to: null, assigned_name: null, due_date: d(8), sort_order: 9, created_at: now, updated_at: now },
    { id: 'ck-010', project_id: 'proj-004', parent_task_id: null, title: 'Recette interne effectuée', phase: 'recette', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: d(10), sort_order: 10, created_at: now, updated_at: now },
    { id: 'ck-011', project_id: 'proj-004', parent_task_id: null, title: 'Recette client effectuée', phase: 'recette', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: d(12), sort_order: 11, created_at: now, updated_at: now },
  ],
  'proj-005': [
    { id: 'ck-101', project_id: 'proj-005', parent_task_id: null, title: 'Brief fonctionnel validé', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-28), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-102', project_id: 'proj-005', parent_task_id: null, title: 'Cahier des charges rédigé et validé', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-25), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-103', project_id: 'proj-005', parent_task_id: null, title: 'Architecture technique définie', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-22), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-104', project_id: 'proj-005', parent_task_id: null, title: 'Sprint 1 : MVP livré', phase: 'developpement', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-15), sort_order: 4, created_at: now, updated_at: now },
    { id: 'ck-105', project_id: 'proj-005', parent_task_id: null, title: 'Sprint 2 : features avancées', phase: 'developpement', status: 'in_progress', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(3), sort_order: 5, created_at: now, updated_at: now },
    { id: 'ck-106', project_id: 'proj-005', parent_task_id: null, title: "Tests unitaires et d'intégration", phase: 'developpement', status: 'in_progress', priority: 'medium', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(5), sort_order: 6, created_at: now, updated_at: now },
    { id: 'ck-107', project_id: 'proj-005', parent_task_id: null, title: 'Recette fonctionnelle complète', phase: 'recette', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: d(7), sort_order: 7, created_at: now, updated_at: now },
  ],
  'proj-006': [
    { id: 'ck-006a', project_id: 'proj-006', parent_task_id: null, title: 'Onboarding complet', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-38), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-006b', project_id: 'proj-006', parent_task_id: null, title: 'Maquettes validées', phase: 'conception', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-28), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-006c', project_id: 'proj-006', parent_task_id: null, title: 'Intégration complète', phase: 'developpement', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-10), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-006d', project_id: 'proj-006', parent_task_id: null, title: 'Module réservation en ligne', phase: 'developpement', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-7), sort_order: 4, created_at: now, updated_at: now },
    { id: 'ck-006e', project_id: 'proj-006', parent_task_id: null, title: 'Recette interne OK', phase: 'recette', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-4), sort_order: 5, created_at: now, updated_at: now },
    { id: 'ck-006f', project_id: 'proj-006', parent_task_id: null, title: 'Recette client en cours', phase: 'recette', status: 'in_progress', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(2), sort_order: 6, created_at: now, updated_at: now },
    { id: 'ck-006g', project_id: 'proj-006', parent_task_id: null, title: 'Mise en ligne', phase: 'post_livraison', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: d(5), sort_order: 7, created_at: now, updated_at: now },
  ],
  'proj-007': [
    { id: 'ck-007a', project_id: 'proj-007', parent_task_id: null, title: 'Onboarding & brief', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-58), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-007b', project_id: 'proj-007', parent_task_id: null, title: 'Maquettes validées', phase: 'conception', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-48), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-007c', project_id: 'proj-007', parent_task_id: null, title: 'Développement', phase: 'developpement', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-25), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-007d', project_id: 'proj-007', parent_task_id: null, title: 'Recette client validée', phase: 'recette', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-18), sort_order: 4, created_at: now, updated_at: now },
    { id: 'ck-007e', project_id: 'proj-007', parent_task_id: null, title: 'Mise en ligne & formation client', phase: 'post_livraison', status: 'done', priority: 'medium', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-15), sort_order: 5, created_at: now, updated_at: now },
    { id: 'ck-007f', project_id: 'proj-007', parent_task_id: null, title: 'Rapport de livraison envoyé', phase: 'post_livraison', status: 'done', priority: 'low', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-14), sort_order: 6, created_at: now, updated_at: now },
  ],
  'proj-008': [
    { id: 'ck-008a', project_id: 'proj-008', parent_task_id: null, title: 'Audit SEO de départ', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-88), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-008b', project_id: 'proj-008', parent_task_id: null, title: 'Optimisations on-page', phase: 'developpement', status: 'done', priority: 'high', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-70), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-008c', project_id: 'proj-008', parent_task_id: null, title: '12 articles SEO rédigés', phase: 'developpement', status: 'done', priority: 'medium', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-50), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-008d', project_id: 'proj-008', parent_task_id: null, title: 'Rapport mensuel envoyé', phase: 'post_livraison', status: 'done', priority: 'low', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-5), sort_order: 4, created_at: now, updated_at: now },
  ],
  'proj-009': [
    { id: 'ck-009a', project_id: 'proj-009', parent_task_id: null, title: 'Brief & onboarding', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-18), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-009b', project_id: 'proj-009', parent_task_id: null, title: 'Maquettes homepage livrées', phase: 'conception', status: 'done', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(-12), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-009c', project_id: 'proj-009', parent_task_id: null, title: 'Intégration homepage', phase: 'developpement', status: 'in_progress', priority: 'high', assigned_to: 'user-carol', assigned_name: 'Carol Petit', due_date: d(8), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-009d', project_id: 'proj-009', parent_task_id: null, title: 'Module commande plateaux repas', phase: 'developpement', status: 'todo', priority: 'high', assigned_to: null, assigned_name: null, due_date: d(20), sort_order: 4, created_at: now, updated_at: now },
  ],
  'proj-010': [
    { id: 'ck-010a', project_id: 'proj-010', parent_task_id: null, title: 'Cahier des charges', phase: 'onboarding', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-118), sort_order: 1, created_at: now, updated_at: now },
    { id: 'ck-010b', project_id: 'proj-010', parent_task_id: null, title: 'Maquettes validées', phase: 'conception', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-100), sort_order: 2, created_at: now, updated_at: now },
    { id: 'ck-010c', project_id: 'proj-010', parent_task_id: null, title: 'Développement complet', phase: 'developpement', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-75), sort_order: 3, created_at: now, updated_at: now },
    { id: 'ck-010d', project_id: 'proj-010', parent_task_id: null, title: 'SEO technique & contenu', phase: 'developpement', status: 'done', priority: 'medium', assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', due_date: d(-70), sort_order: 4, created_at: now, updated_at: now },
    { id: 'ck-010e', project_id: 'proj-010', parent_task_id: null, title: 'Recette & mise en ligne', phase: 'recette', status: 'done', priority: 'high', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-62), sort_order: 5, created_at: now, updated_at: now },
    { id: 'ck-010f', project_id: 'proj-010', parent_task_id: null, title: 'Bilan & clôture projet', phase: 'post_livraison', status: 'done', priority: 'low', assigned_to: 'user-alice', assigned_name: 'Alice Martin', due_date: d(-60), sort_order: 6, created_at: now, updated_at: now },
  ],
}
