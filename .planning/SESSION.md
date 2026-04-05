# Session State — 2026-04-05 17:30

## Branch
N/A — pas de git repo

## Completed This Session
- ProjectFollowUp refonte : 5 sous-onglets (RDV, Emails, Suivi, Brief, Accès)
- RDV section : meetings Gmail séparés À venir / Passés avec détails ICS
- Emails section : groupés par catégorie (Devis, Contrat, Facturation, Communication, Support, Autre)
- Brief + Accès déplacés dans Suivi, retirés de la barre principale
- Bouton Sync Gmail intégré dans les onglets RDV et Emails
- Migration Supabase : ajout type `meeting` à project_activities_v2_type_check
- Fix données existantes : 3 invitations Gmail converties en type `meeting` avec métadonnées
- Edge function gmail-sync v11 : détection ICS inline (text/calendar), .ics attachment, fallback sujet
- CLAUDE.md : règle sauvegarde automatique à 50% contexte

## Next Task
Tester le flow complet depuis la fiche projet Lolett : cliquer Sync Gmail → vérifier que nouveaux RDV apparaissent dans l'onglet RDV du Suivi

## Blockers
None

## Key Context
- Projet Supabase : wftozvnvstxzvfplveyz
- Projet Lolett ID : 9122fd4d-9dfc-4d3e-8d92-b6fa047d5936
- Gmail connecté : lyestriki@gmail.com (règle email : team@propulseo-site.com)
- useActivitiesV2 expose maintenant updateActivity + refetch
- Tabs principaux restants : Vue d'ensemble · Checklist · Journal · Documents · Facturation · Suivi · Gmail
