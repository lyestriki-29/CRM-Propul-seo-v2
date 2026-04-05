import type { ProjectActivity } from '../../../types/project-v2'

const d = (daysOffset: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + daysOffset)
  return dt.toISOString()
}

export const MOCK_ACTIVITIES: Record<string, ProjectActivity[]> = {
  'proj-004': [
    {
      id: 'act-001', project_id: 'proj-004', user_id: 'user-carol',
      author_name: 'Carol Petit', type: 'status', is_auto: true,
      content: 'Projet passé en statut "En cours"',
      metadata: { from: 'brief_received', to: 'in_progress' },
      created_at: d(-20),
    },
    {
      id: 'act-002', project_id: 'proj-004', user_id: 'user-carol',
      author_name: 'Carol Petit', type: 'task', is_auto: true,
      content: 'Tâche terminée : Brief initial validé',
      metadata: { task_id: 'ck-001' },
      created_at: d(-18),
    },
    {
      id: 'act-003', project_id: 'proj-004', user_id: 'user-alice',
      author_name: 'Alice Martin', type: 'file', is_auto: true,
      content: 'Document uploadé : Maquettes_Desktop_V1.fig (V1)',
      metadata: { document_id: 'doc-001' },
      created_at: d(-12),
    },
    {
      id: 'act-004', project_id: 'proj-004', user_id: 'user-carol',
      author_name: 'Carol Petit', type: 'call', is_auto: false,
      content: 'Appel client 30min — Validation des maquettes. Client très satisfait, quelques ajustements couleurs demandés sur la homepage.',
      created_at: d(-8),
    },
    {
      id: 'act-005', project_id: 'proj-004', user_id: 'user-carol',
      author_name: 'Carol Petit', type: 'task', is_auto: true,
      content: 'Tâche terminée : Validation client des maquettes',
      metadata: { task_id: 'ck-006' },
      created_at: d(-7),
    },
    {
      id: 'act-006', project_id: 'proj-004', user_id: null,
      author_name: null, type: 'system', is_auto: true,
      content: 'Score de complétude mis à jour : 58%',
      created_at: d(-1),
    },
  ],
  'proj-005': [
    {
      id: 'act-101', project_id: 'proj-005', user_id: 'user-bob',
      author_name: 'Bob Lefèvre', type: 'status', is_auto: true,
      content: 'Projet passé en statut "En cours"',
      metadata: { from: 'quote_sent', to: 'in_progress' },
      created_at: d(-30),
    },
    {
      id: 'act-102', project_id: 'proj-005', user_id: 'user-bob',
      author_name: 'Bob Lefèvre', type: 'access', is_auto: true,
      content: 'Accès ajouté : Serveur OVH (hosting)',
      created_at: d(-28),
    },
    {
      id: 'act-103', project_id: 'proj-005', user_id: 'user-bob',
      author_name: 'Bob Lefèvre', type: 'decision', is_auto: false,
      content: 'Décision architecture : Stack Laravel + Vue.js retenue après comparaison avec Next.js. Raison : expertise interne et hébergement mutualisé client.',
      created_at: d(-22),
    },
    {
      id: 'act-104', project_id: 'proj-005', user_id: 'user-bob',
      author_name: 'Bob Lefèvre', type: 'task', is_auto: true,
      content: 'Tâche terminée : Sprint 1 — MVP livré',
      created_at: d(-15),
    },
    {
      id: 'act-105', project_id: 'proj-005', user_id: 'user-bob',
      author_name: 'Bob Lefèvre', type: 'call', is_auto: false,
      content: 'Démo Sprint 1 client — 1h. Retours positifs sur le module gestion des mandats. Demande de changement : ajouter export PDF des contrats.',
      created_at: d(-14),
    },
    {
      id: 'act-106', project_id: 'proj-005', user_id: 'user-bob',
      author_name: 'Bob Lefèvre', type: 'invoice', is_auto: true,
      content: 'Facture émise : Acompte 30% — 6 600 €',
      metadata: { amount: 6600, invoice_id: 'inv-001' },
      created_at: d(-10),
    },
  ],
}
