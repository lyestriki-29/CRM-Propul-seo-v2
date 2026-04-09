import type { CommMonthlyCycle, CommCycleTask } from '../../../types/project-v2'

const now = new Date().toISOString()

export const MOCK_COMM_CYCLES: Record<string, CommMonthlyCycle[]> = {
  'comm-001': [
    { id: 'cyc-001-jan', project_id: 'comm-001', mois: '2026-01-01', label: 'Janvier 2026', status: 'termine', created_at: now },
    { id: 'cyc-001-feb', project_id: 'comm-001', mois: '2026-02-01', label: 'Février 2026', status: 'termine', created_at: now },
    { id: 'cyc-001-mar', project_id: 'comm-001', mois: '2026-03-01', label: 'Mars 2026', status: 'termine', created_at: now },
    { id: 'cyc-001-apr', project_id: 'comm-001', mois: '2026-04-01', label: 'Avril 2026', status: 'en_cours', created_at: now },
  ],
}

export const MOCK_COMM_CYCLE_TASKS: Record<string, CommCycleTask[]> = {
  'cyc-001-jan': [
    { id: 'ct-jan-1', cycle_id: 'cyc-001-jan', project_id: 'comm-001', title: 'Brief mensuel reçu', done: true, sort_order: 1 },
    { id: 'ct-jan-2', cycle_id: 'cyc-001-jan', project_id: 'comm-001', title: 'Calendrier éditorial validé', done: true, sort_order: 2 },
    { id: 'ct-jan-3', cycle_id: 'cyc-001-jan', project_id: 'comm-001', title: 'Visuels créés', done: true, sort_order: 3 },
    { id: 'ct-jan-4', cycle_id: 'cyc-001-jan', project_id: 'comm-001', title: 'Textes rédigés', done: true, sort_order: 4 },
    { id: 'ct-jan-5', cycle_id: 'cyc-001-jan', project_id: 'comm-001', title: 'Validation client', done: true, sort_order: 5 },
    { id: 'ct-jan-6', cycle_id: 'cyc-001-jan', project_id: 'comm-001', title: 'Programmation des posts', done: true, sort_order: 6 },
    { id: 'ct-jan-7', cycle_id: 'cyc-001-jan', project_id: 'comm-001', title: 'Rapport de performance envoyé', done: true, sort_order: 7 },
  ],
  'cyc-001-apr': [
    { id: 'ct-apr-1', cycle_id: 'cyc-001-apr', project_id: 'comm-001', title: 'Brief mensuel reçu', done: true, sort_order: 1 },
    { id: 'ct-apr-2', cycle_id: 'cyc-001-apr', project_id: 'comm-001', title: 'Calendrier éditorial validé', done: true, sort_order: 2 },
    { id: 'ct-apr-3', cycle_id: 'cyc-001-apr', project_id: 'comm-001', title: 'Visuels créés', done: false, sort_order: 3 },
    { id: 'ct-apr-4', cycle_id: 'cyc-001-apr', project_id: 'comm-001', title: 'Textes rédigés', done: false, sort_order: 4 },
    { id: 'ct-apr-5', cycle_id: 'cyc-001-apr', project_id: 'comm-001', title: 'Validation client', done: false, sort_order: 5 },
    { id: 'ct-apr-6', cycle_id: 'cyc-001-apr', project_id: 'comm-001', title: 'Programmation des posts', done: false, sort_order: 6 },
    { id: 'ct-apr-7', cycle_id: 'cyc-001-apr', project_id: 'comm-001', title: 'Rapport de performance envoyé', done: false, sort_order: 7 },
  ],
}
