# Session State — 2026-04-27

## Branch
main

## Completed This Session
- Refonte rendu fiche Procédure : 3 variantes preview (Docs/Mag/KB) puis 4 enterprise (Conseil/SOP/RFC/Notion). Choix final = **Conseil** (renommé Doc).
- Cleanup : suppression des 6 autres variantes + VariantSwitcher. Doc est la norme unique.
- Template par défaut à la création (Contexte / Procédure / Astuces / Validation) → pousse la structure que Doc exploite (numérotation auto h2/h3, callouts via emoji).
- 4 boutons callouts dans toolbar TipTap (1-clic insertion 💡⚠️✅ℹ️).
- Aperçu live split-view dans l'éditeur (toggle Eye).
- Migration `20260425_fix_double_apostrophes.sql` créée mais **PAS encore appliquée** sur prod.
- Doc full-width : suppression `max-w-[760px]` sur la colonne principale.
- Commit `cb1f3e8` push sur main.

## Next Task
**Câbler le routing URL.** L'app utilise actuellement Zustand `activeModule` (string) pour la nav — donc URL fixe, refresh = reset au défaut. À faire :
1. Installer `react-router-dom` (le repo est Vite/React, pas Next).
2. Wrap `App.tsx` avec `<BrowserRouter>`.
3. Définir routes pour chaque module (`/dashboard`, `/projets`, `/communication`, `/erp`, `/site-web`, `/contacts`, `/clients/:id`, `/projets/:id`, `/procedures`, `/procedures/:slug`, `/comptabilite`, `/parametres`, etc.).
4. Remplacer `setActiveModule()` par `navigate()`.
5. Sidebar : transformer les buttons en `<NavLink>` pour le highlight automatique.
6. Vérifier que Vercel a bien le rewrite SPA (`vercel.json` ou config) pour que `/procedures/foo` ne 404 pas en prod.

## Blockers
**Migration apostrophes à appliquer manuellement** sur Supabase prod `tbuqctfgjjxnevmsvucl` via SQL Editor (sinon `l''adresse` reste affiché sur les 16 fiches existantes).

## Key Context
- Login admin Vercel projet `crm-propulseo` : team `team_PGObt4GifDGrYd18ieqpAiSY` (PAS lolett64). CLI local n'a pas accès.
- Comptes admin app : `team@propulseo-site.com` (Etienne), `admin@propulseo.com` (Admin). MDP saisi `Raodto100k!` était mauvais — reset via Supabase Dashboard Auth.
- Toute UI/feature à coder dans modules **V2** uniquement (CommunicationManager, ERPManager, SiteWebManager, ProjectsManagerV2, DashboardV2). Jamais les anciens.
