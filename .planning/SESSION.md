# Session State — 2026-04-10 01:15

## Branch
main

## Completed This Session
- fix(checklist): checklist vide pour projets mock — useMockChecklist réécrit en hook smart (local state pour sw-/erp-/comm-, Supabase sinon)
- fix(nav): clic projet → fiche ProjectDetailsV2 HubSpot-style pour SiteWeb, ERP, Comm
- fix(hooks): "Rendered fewer hooks" — useMemo déplacé avant early return dans SiteWeb + Comm
- fix(context): ProjectsV2Provider wrappé dans Layout.tsx pour les 3 nouveaux modules
- feat(erp-kanban): refonte visuelle ERPManager kanban — même style que SiteWeb (headers colorés, sans select, sans side panel)

## Next Task
Rien de bloquant. Tester en dev (`npm run dev`) les 3 modules + checklist.
Prochaine étape possible : brancher sur Supabase (remplacer les mocks).

## Blockers
None

## Key Context
- useMockChecklist.ts est désormais un vrai hook (plus alias). Détecte isMockProject() → local state (MOCK_SITEWEB_CHECKLISTS + MOCK_ERP_CHECKLISTS) ou Supabase.
- comm- projects : checklist vide → template "Communication" proposé automatiquement.
- ERPManager : plus de <select> ni side panel sur le kanban. Clic → ProjectDetailsV2 plein écran.
- Les 3 modules wrappés dans ProjectsV2Provider dans Layout.tsx (nécessaire pour useProjectsV2Context dans les enfants).
- MOCK_COMM_BRIEFS = BriefComm[] (array). ERPBriefTab supprimé du side panel ERP.
