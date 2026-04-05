import type { ProjectActivity } from '../../../types/project-v2'

const d = (daysOffset: number) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + daysOffset)
  return dt.toISOString()
}

export const MOCK_ACTIVITIES: Record<string, ProjectActivity[]> = {
  'proj-001': [
    { id: 'act-001a', project_id: 'proj-001', user_id: 'user-alice', author_name: 'Alice Martin', type: 'status', is_auto: true, content: 'Projet créé en statut "Prospect"', metadata: { to: 'prospect' }, created_at: d(-2) },
    { id: 'act-001b', project_id: 'proj-001', user_id: 'user-alice', author_name: 'Alice Martin', type: 'call', is_auto: false, content: 'Appel découverte 20min — Boulangerie Dupont. Client souhaite réservation en ligne + menu digital. Budget OK.', created_at: d(-1) },
  ],
  'proj-002': [
    { id: 'act-002a', project_id: 'proj-002', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'status', is_auto: true, content: 'Brief reçu — projet passé en "Brief reçu"', metadata: { from: 'prospect', to: 'brief_received' }, created_at: d(-10) },
    { id: 'act-002b', project_id: 'proj-002', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'task', is_auto: true, content: 'Tâche terminée : Audit SEO initial', created_at: d(-4) },
    { id: 'act-002c', project_id: 'proj-002', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'email', is_auto: false, content: 'Email rapport audit envoyé au client. 47 mots-clés identifiés, 3 concurrents analysés.', created_at: d(-3) },
    { id: 'act-002d', project_id: 'proj-002', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'task', is_auto: true, content: 'Tâche terminée : Validation stratégie mots-clés', created_at: d(-2) },
  ],
  'proj-003': [
    { id: 'act-003a', project_id: 'proj-003', user_id: 'user-alice', author_name: 'Alice Martin', type: 'status', is_auto: true, content: 'Devis envoyé — projet passé en "Devis envoyé"', metadata: { from: 'brief_received', to: 'quote_sent' }, created_at: d(-7) },
    { id: 'act-003b', project_id: 'proj-003', user_id: 'user-alice', author_name: 'Alice Martin', type: 'decision', is_auto: false, content: 'Proposition de 3 phases : MVP (3 mois), V1 (5 mois), V2 (8 mois). Budget total : 18 000 €. Devis PDF envoyé.', created_at: d(-6) },
    { id: 'act-003c', project_id: 'proj-003', user_id: 'user-alice', author_name: 'Alice Martin', type: 'call', is_auto: false, content: 'Call de suivi devis — 30min. Client intéressé, demande 2 semaines pour valider en interne.', created_at: d(-3) },
  ],
  'proj-004': [
    { id: 'act-001', project_id: 'proj-004', user_id: 'user-carol', author_name: 'Carol Petit', type: 'status', is_auto: true, content: 'Projet passé en statut "En cours"', metadata: { from: 'brief_received', to: 'in_progress' }, created_at: d(-20) },
    { id: 'act-002', project_id: 'proj-004', user_id: 'user-carol', author_name: 'Carol Petit', type: 'task', is_auto: true, content: 'Tâche terminée : Brief initial validé', metadata: { task_id: 'ck-001' }, created_at: d(-18) },
    { id: 'act-003', project_id: 'proj-004', user_id: 'user-alice', author_name: 'Alice Martin', type: 'file', is_auto: true, content: 'Document uploadé : Maquettes_Desktop_V1.fig (V1)', metadata: { document_id: 'doc-001' }, created_at: d(-12) },
    { id: 'act-004', project_id: 'proj-004', user_id: 'user-carol', author_name: 'Carol Petit', type: 'call', is_auto: false, content: 'Appel client 30min — Validation des maquettes. Client très satisfait, quelques ajustements couleurs demandés sur la homepage.', created_at: d(-8) },
    { id: 'act-005', project_id: 'proj-004', user_id: 'user-carol', author_name: 'Carol Petit', type: 'task', is_auto: true, content: 'Tâche terminée : Validation client des maquettes', metadata: { task_id: 'ck-006' }, created_at: d(-7) },
    { id: 'act-006', project_id: 'proj-004', user_id: null, author_name: null, type: 'system', is_auto: true, content: 'Score de complétude mis à jour : 58%', created_at: d(-1) },
  ],
  'proj-005': [
    { id: 'act-101', project_id: 'proj-005', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'status', is_auto: true, content: 'Projet passé en statut "En cours"', metadata: { from: 'quote_sent', to: 'in_progress' }, created_at: d(-30) },
    { id: 'act-102', project_id: 'proj-005', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'access', is_auto: true, content: 'Accès ajouté : Serveur OVH (hosting)', created_at: d(-28) },
    { id: 'act-103', project_id: 'proj-005', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'decision', is_auto: false, content: 'Décision architecture : Stack Laravel + Vue.js retenue après comparaison avec Next.js. Raison : expertise interne et hébergement mutualisé client.', created_at: d(-22) },
    { id: 'act-104', project_id: 'proj-005', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'task', is_auto: true, content: 'Tâche terminée : Sprint 1 — MVP livré', created_at: d(-15) },
    { id: 'act-105', project_id: 'proj-005', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'call', is_auto: false, content: 'Démo Sprint 1 client — 1h. Retours positifs sur le module gestion des mandats. Demande de changement : ajouter export PDF des contrats.', created_at: d(-14) },
    { id: 'act-106', project_id: 'proj-005', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'invoice', is_auto: true, content: 'Facture émise : Acompte 30% — 6 600 €', metadata: { amount: 6600, invoice_id: 'inv-001' }, created_at: d(-10) },
  ],
  'proj-006': [
    { id: 'act-006a', project_id: 'proj-006', user_id: 'user-carol', author_name: 'Carol Petit', type: 'status', is_auto: true, content: 'Projet passé en recette', metadata: { from: 'in_progress', to: 'review' }, created_at: d(-4) },
    { id: 'act-006b', project_id: 'proj-006', user_id: 'user-carol', author_name: 'Carol Petit', type: 'call', is_auto: false, content: 'Call recette client 45min. 3 retours mineurs : ajustement couleurs menu, photo hero, formulaire réservation. Correction en cours.', created_at: d(-2) },
    { id: 'act-006c', project_id: 'proj-006', user_id: 'user-carol', author_name: 'Carol Petit', type: 'invoice', is_auto: true, content: 'Facture émise : Situation 50% — 1 400 €', metadata: { amount: 1400 }, created_at: d(-2) },
  ],
  'proj-007': [
    { id: 'act-007a', project_id: 'proj-007', user_id: 'user-alice', author_name: 'Alice Martin', type: 'status', is_auto: true, content: 'Projet livré', metadata: { from: 'review', to: 'delivered' }, created_at: d(-15) },
    { id: 'act-007b', project_id: 'proj-007', user_id: 'user-alice', author_name: 'Alice Martin', type: 'invoice', is_auto: true, content: 'Facture solde émise : 820 € — Projet clôturé côté facturation', metadata: { amount: 820 }, created_at: d(-15) },
    { id: 'act-007c', project_id: 'proj-007', user_id: 'user-alice', author_name: 'Alice Martin', type: 'email', is_auto: false, content: 'Rapport de livraison envoyé. Accès transmis, formation 1h réalisée en visio.', created_at: d(-14) },
  ],
  'proj-008': [
    { id: 'act-008a', project_id: 'proj-008', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'status', is_auto: true, content: 'Projet passé en maintenance', metadata: { from: 'delivered', to: 'maintenance' }, created_at: d(-30) },
    { id: 'act-008b', project_id: 'proj-008', user_id: 'user-bob', author_name: 'Bob Lefèvre', type: 'task', is_auto: true, content: 'Rapport mensuel SEO envoyé — +28% de trafic organique', created_at: d(-5) },
  ],
  'proj-009': [
    { id: 'act-009a', project_id: 'proj-009', user_id: 'user-carol', author_name: 'Carol Petit', type: 'status', is_auto: true, content: 'Projet mis en pause — client en attente de validation budget interne', metadata: { from: 'in_progress', to: 'on_hold' }, created_at: d(-8) },
    { id: 'act-009b', project_id: 'proj-009', user_id: 'user-carol', author_name: 'Carol Petit', type: 'call', is_auto: false, content: "Appel client — Pause de 3-4 semaines. Directeur à l'étranger, validation budget reportée.", created_at: d(-8) },
  ],
  'proj-010': [
    { id: 'act-010a', project_id: 'proj-010', user_id: 'user-alice', author_name: 'Alice Martin', type: 'status', is_auto: true, content: 'Projet clôturé', metadata: { from: 'maintenance', to: 'closed' }, created_at: d(-60) },
    { id: 'act-010b', project_id: 'proj-010', user_id: 'user-alice', author_name: 'Alice Martin', type: 'invoice', is_auto: true, content: 'Dernière facture réglée — Projet entièrement soldé', created_at: d(-60) },
    { id: 'act-010c', project_id: 'proj-010', user_id: 'user-alice', author_name: 'Alice Martin', type: 'email', is_auto: false, content: 'Email bilan final envoyé. ROI : +340% trafic organique sur 12 mois. Client très satisfait, potentiel de renouvellement SEO.', created_at: d(-59) },
  ],
}
