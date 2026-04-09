# Session State — 2026-04-09 23:45

## Branch
main

## Completed This Session
- Task 1: types project-v2.ts — StatusSiteWeb/ERP/Comm, BriefSiteWeb/ERP/Comm, CommMonthlyCycle
- Task 2: mocks SiteWebManager — projets, briefs, checklists
- Task 3: SiteWebManager — hook + SiteWebBriefTab + index (kanban 6 col)
- Task 4: ERPManager complet — mocks + hook + ERPBriefTab + index (kanban 8 col)
- Task 5: mocks CommunicationManager — projets, briefs, checklists, cycles mensuels
- Task 6: CommunicationManager — hooks + CommBriefTab + CommMonthlyCycles + index (kanban 8 col)
- Task 7: Sidebar + Layout wiring — 3 nouveaux modules (site-web, erp-manager, comm-manager)
- Task 8: DashboardV2 KPIs globaux — CA total, MRR, ventilation par pôle

## Next Task
Plan 100% terminé. Prochaine étape : brancher les modules sur Supabase (remplacer les mocks).
Ou review UX / ajout checklist dans SiteWebManager et ERPManager.

## Blockers
None

## Key Context
- MOCK_COMM_BRIEFS est un BriefComm[] (array, pas Record) — utiliser .find(b => b.project_id === id)
- COMM_CHECKLIST_INSTAGRAM (pas ABONNEMENT) est le bon export name
- ERPManager : kanban cards sont des <div role="button"> (pas <button>) pour éviter nested interactive elements
- Erreurs TS pré-existantes dans supabaseService.ts/accountingSlice.ts — ne pas toucher, le build passe quand même
- glass-card est une classe CSS custom dispo dans DashboardV2
