# Session State — 2026-04-17 15:00

## Branch
main

## Completed This Session
- Schéma v2 Supabase : créé schema + 10 vues + permissions + check constraints
- Proxy v2 : contourne PostgREST en mappant v2.from('table') → supabase.from('table_v2')
- 3 hooks migrés Supabase : useMockSiteWebProjects, useMockERPProjects, useMockCommProjects
- ProjectStatusBadge : ajout tous statuts modules + fallback
- Null safety : presta_type?.length (5 fichiers), budget guards vérifiés
- SyntheseTab : ajout ShareBriefButton + CRUD accès coffre-fort
- 3 projets test + brief + accès + activités insérés en DB

## Next Task
Tester le flow complet dans le navigateur : créer un projet depuis SiteWeb/ERP, vérifier persistance au refresh, cliquer pour ouvrir les détails, tester ajout accès et génération lien brief

## Blockers
None

## Key Context
- PostgREST Supabase hébergé ne supporte PAS `ALTER ROLE authenticator SET pgrst.db_schemas` → proxy dans supabase.ts à la place
- 13 tables v2 n'existent pas encore (kpi, notifications, features, etc.) — hooks échouent silencieusement, à créer au fur et à mesure
- Column rename : project_accesses_v2.service_name → label
