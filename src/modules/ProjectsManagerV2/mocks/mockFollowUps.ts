import type { FollowUpEntry } from '../../../types/project-v2'

const d = (daysOffset: number): string => {
  const dt = new Date()
  dt.setDate(dt.getDate() + daysOffset)
  return dt.toISOString().split('T')[0]
}
const ts = (daysOffset: number): string => {
  const dt = new Date()
  dt.setDate(dt.getDate() + daysOffset)
  return dt.toISOString()
}

export const MOCK_FOLLOW_UPS: Record<string, FollowUpEntry[]> = {
  'proj-001': [
    {
      id: 'fu-001a', project_id: 'proj-001', type: 'appel', date: d(-1),
      summary: 'Appel découverte 20min. Client confirme le budget (3 500 €) et souhaite démarrer rapidement. Intéressé par le module réservation en ligne.',
      follow_up_action: 'Envoyer le devis détaillé', follow_up_date: d(2), follow_up_done: false,
      assigned_to: 'user-alice', assigned_name: 'Alice Martin', created_at: ts(-1),
    },
  ],
  'proj-002': [
    {
      id: 'fu-002a', project_id: 'proj-002', type: 'rdv', date: d(-10),
      summary: 'RDV onboarding SEO 1h. Présentation de la stratégie mots-clés, validation des 47 termes cibles. Client satisfait de l\'audit initial.',
      follow_up_action: 'Envoyer le rapport d\'audit complet par email', follow_up_date: d(-8), follow_up_done: true,
      assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', created_at: ts(-10),
    },
    {
      id: 'fu-002b', project_id: 'proj-002', type: 'email', date: d(-3),
      summary: 'Email de suivi envoyé avec le rapport d\'audit + plan d\'action sur 3 mois. Client a répondu positivement.',
      follow_up_action: 'Relancer si pas de retour sous 5 jours', follow_up_date: d(2), follow_up_done: false,
      assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', created_at: ts(-3),
    },
  ],
  'proj-003': [
    {
      id: 'fu-003a', project_id: 'proj-003', type: 'rdv', date: d(-7),
      summary: 'Présentation du devis (18 000 €) en visio 1h. Très bonne réception. CTO présent — questions techniques sur la stack. Proposition en 3 phases validée sur le principe.',
      follow_up_action: 'Relance validation devis', follow_up_date: d(7), follow_up_done: false,
      assigned_to: 'user-alice', assigned_name: 'Alice Martin', created_at: ts(-7),
    },
    {
      id: 'fu-003b', project_id: 'proj-003', type: 'appel', date: d(-3),
      summary: 'Appel de suivi 30min. Directeur en déplacement, décision reportée à la semaine prochaine. Pas de blocage côté budget.',
      follow_up_action: null, follow_up_date: null, follow_up_done: false,
      assigned_to: 'user-alice', assigned_name: 'Alice Martin', created_at: ts(-3),
    },
  ],
  'proj-004': [
    {
      id: 'fu-004a', project_id: 'proj-004', type: 'rdv', date: d(-20),
      summary: 'Réunion de lancement 1h30 sur site. Présentation de l\'équipe, validation du planning, remise des accès hébergement. Client très impliqué.',
      follow_up_action: 'Récupérer les photos et textes du client', follow_up_date: d(-16), follow_up_done: true,
      assigned_to: 'user-carol', assigned_name: 'Carol Petit', created_at: ts(-20),
    },
    {
      id: 'fu-004b', project_id: 'proj-004', type: 'appel', date: d(-8),
      summary: 'Validation des maquettes en appel 30min. Client demande ajustements couleurs sur la homepage et agrandissement du logo. OK pour le reste.',
      follow_up_action: 'Appliquer les corrections et renvoyer pour validation finale', follow_up_date: d(-5), follow_up_done: true,
      assigned_to: 'user-alice', assigned_name: 'Alice Martin', created_at: ts(-8),
    },
    {
      id: 'fu-004c', project_id: 'proj-004', type: 'email', date: d(-2),
      summary: 'Email point d\'avancement envoyé. Intégration à 65%, on reste dans les délais. Prochaine étape : recette interne dans 8 jours.',
      follow_up_action: 'Planifier la démo de recette avec le client', follow_up_date: d(6), follow_up_done: false,
      assigned_to: 'user-carol', assigned_name: 'Carol Petit', created_at: ts(-2),
    },
  ],
  'proj-005': [
    {
      id: 'fu-005a', project_id: 'proj-005', type: 'rdv', date: d(-30),
      summary: 'Réunion de démarrage projet ERP. Signature du contrat 22 000 €. Présentation de l\'équipe technique. Accès serveur remis.',
      follow_up_action: 'Envoyer la facture acompte 30%', follow_up_date: d(-28), follow_up_done: true,
      assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', created_at: ts(-30),
    },
    {
      id: 'fu-005b', project_id: 'proj-005', type: 'rdv', date: d(-14),
      summary: 'Démo Sprint 1 (MVP) en visio 1h. Client très satisfait du module gestion des mandats. Demande d\'ajout : export PDF des contrats de vente. Accord pour intégrer en Sprint 2.',
      follow_up_action: 'Chiffrer l\'export PDF et intégrer au Sprint 2', follow_up_date: d(-10), follow_up_done: true,
      assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', created_at: ts(-14),
    },
    {
      id: 'fu-005c', project_id: 'proj-005', type: 'appel', date: d(-3),
      summary: 'Point d\'avancement Sprint 2. Export PDF en cours, 70% réalisé. Recette prévue dans 8 jours. Client confirme les délais.',
      follow_up_action: 'Préparer environnement de recette', follow_up_date: d(4), follow_up_done: false,
      assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', created_at: ts(-3),
    },
  ],
  'proj-006': [
    {
      id: 'fu-006a', project_id: 'proj-006', type: 'rdv', date: d(-40),
      summary: 'RDV de lancement sur place au restaurant. Très bonne ambiance. Photos et vidéo drone commandées. Charte graphique validée : tons méditerranéens.',
      follow_up_action: 'Récupérer les photos HD et la vidéo drone', follow_up_date: d(-30), follow_up_done: true,
      assigned_to: 'user-carol', assigned_name: 'Carol Petit', created_at: ts(-40),
    },
    {
      id: 'fu-006b', project_id: 'proj-006', type: 'appel', date: d(-2),
      summary: 'Call recette 45min. 3 retours du client : ajustement couleur bouton réservation, photo hero à remplacer, formulaire contact à simplifier. Corrections mineures.',
      follow_up_action: 'Appliquer les 3 corrections + envoyer lien de recette finale', follow_up_date: d(3), follow_up_done: false,
      assigned_to: 'user-carol', assigned_name: 'Carol Petit', created_at: ts(-2),
    },
  ],
  'proj-007': [
    {
      id: 'fu-007a', project_id: 'proj-007', type: 'rdv', date: d(-14),
      summary: 'Livraison officielle du site. Formation client 1h en visio sur la gestion WordPress. Accès admin transmis. Client très satisfait.',
      follow_up_action: 'Envoyer le rapport de livraison et la facture solde', follow_up_date: d(-13), follow_up_done: true,
      assigned_to: 'user-alice', assigned_name: 'Alice Martin', created_at: ts(-14),
    },
  ],
  'proj-008': [
    {
      id: 'fu-008a', project_id: 'proj-008', type: 'email', date: d(-5),
      summary: 'Rapport mensuel SEO envoyé. Résultats : +28% de trafic organique, 3 mots-clés en top 5. Client très content, évoque renouvellement.',
      follow_up_action: 'Proposer une extension de contrat + audit annuel', follow_up_date: d(10), follow_up_done: false,
      assigned_to: 'user-bob', assigned_name: 'Bob Lefèvre', created_at: ts(-5),
    },
  ],
  'proj-009': [
    {
      id: 'fu-009a', project_id: 'proj-009', type: 'appel', date: d(-8),
      summary: 'Appel client pour faire le point. Directeur absent pour 3-4 semaines. Budget non encore validé en interne. Projet mis en pause à leur demande.',
      follow_up_action: 'Relancer dans 3 semaines', follow_up_date: d(13), follow_up_done: false,
      assigned_to: 'user-carol', assigned_name: 'Carol Petit', created_at: ts(-8),
    },
  ],
  'proj-010': [
    {
      id: 'fu-010a', project_id: 'proj-010', type: 'rdv', date: d(-62),
      summary: 'Livraison du portail. Bilan final très positif. +340% de trafic organique sur 12 mois. Client évoque une mission SEO long terme.',
      follow_up_action: null, follow_up_date: null, follow_up_done: false,
      assigned_to: 'user-alice', assigned_name: 'Alice Martin', created_at: ts(-62),
    },
  ],
}
