# Session State — 2026-04-29

## Branch
main

## Completed This Session
- Routing URL câblé partout (react-router-dom v7) : `<BrowserRouter>` dans App.tsx, `<Routes>` dans Layout, `<NavLink>` dans Sidebar.
- Mapping centralisé `src/lib/routes.ts` (URLs FR : /dashboard, /projets, /procedures, /comptabilite, etc.) avec helpers `botOneRecord(id)`, `crmErpLead(id)`, `projectDetail(id)`, `clientDetail(id)`, `procedureDetail(slug)`, etc.
- Sous-routes câblées : `/bot-one/:recordId`, `/crm-erp/leads/:leadId`, `/projets/:id`, `/clients/:id`, `/procedures/:slug` (+ `/edit`, `/revisions`).
- 18 call sites `setActiveModule` / `navigateWithContext` migrés → `useNavigate`. Permaliens via `useParams`, transients via `?p=`, `?edit=`, `?from=`.
- `navigationSlice` supprimé du store ; types `Store` (store/types.ts + types/index.ts) nettoyés ; `selectActiveModule`/`selectNavigationContext` retirés.
- App.tsx : routes publiques `/portal/:token`, `/brief/:token`, `/brief-invite/:token` extraites en composants validés via regex shortCode.
- Layout.tsx : redirection permissions via `getPermissionForPath()` + `navigate(replace:true)`, fallback `*` → `/dashboard`.
- Build ✓ (17.88s, erreurs TS pré-existantes uniquement) ; dev server répond 200 sur `/`, `/dashboard`, `/procedures`.
- Commits `e9aae53` (top-level routing) + `2629cd4` (sous-routes details/onglets) + `c9c5616` (merge `feat/routing-detail-views`) + `647d085` (WYSIWYG procedures) déjà push sur main.

## Next Task
Sprint suivant ouvert. Pistes naturelles :
1. **Audit erreurs TS pré-existantes** : ~80 erreurs TS6133 (imports/vars unused) + quelques TS2322/TS2339 réels — à nettoyer avec `npm run lint --fix` + passes ciblées (composants Header, MobileCalendar, useMentionNotifications, UserSelector).
2. **Module Procédures Phase 3** : recherche full-text (`procedures.content_text` indexé tsvector), filtres tags, raccourcis clavier (Cmd+K palette).
3. **Dashboard V2** : vrais KPI temps-réel (subscriber Realtime sur `accounting_entries` + `projects_v2`).

Demander à l'utilisateur quelle direction prendre.

## Blockers
Aucun.

## Key Context
- Migration `20260425_fix_double_apostrophes.sql` appliquée et vérifiée (0 doubles `''` en base) — ticket fermé.
- Routes URL FR canoniques. URLs partagées de la forme `/projets/:id`, `/clients/:id`, `/procedures/:slug` — ces IDs/slugs sont stables.
- Compat `?p=:id` sur `/projets` redirige automatiquement vers `/projets/:id` (anciens partages de liens).
- `?from=dashboard` utilisé pour afficher le bouton retour conditionnel sur CRM/CRMERP.
- Toute UI/feature à coder dans modules **V2** uniquement (CommunicationManager, ERPManager, SiteWebManager, ProjectsManagerV2, DashboardV2, ProceduresManager).
