# Session State — 2026-04-20 10:00

## Branch
main

## Completed This Session
- Migration projets v1 → projects_v2 : 11 site_web + 15 ERP insérés dans le BON projet Supabase (tbuqctfgjjxnevmsvucl)
- CHECK constraint status élargi pour accepter statuts modules (SiteWeb/ERP/Comm)
- Bouton Supprimer ajouté en haut à droite de ProjectDetailsV2 (SiteWeb + ERP)
- Déploiement Vercel configuré : compte lyestriki-1222, projet crm-propulseo, URL https://crm-propulseo-red.vercel.app
- Env vars Supabase ajoutées à Vercel prod
- Sidebar : "En cours" → "Projets", suppression entrée "Mois en cours"
- 8 projets "test" supprimés de projects_v2
- Dashboard V2 KPI branchés sur accounting_entries (fin des mocks) : nouveau hook useDashboardKpisV2
- Permissions : bypass admin basé sur role='admin' au lieu d'email hardcodé → Admin a les mêmes droits qu'Etienne
- V2 access accordé à Thibaut, Lucie, théo, Pierre (can_view_dashboard + can_view_projects)

## Next Task
Fixer les fonctionnalités cassées :
1. Envoi du lien portail client pour suivi (SharePortalButton dans SyntheseTab)
2. Envoi du brief (brief_invitations / BriefLink)

## Blockers
- Projet Supabase wftozvnvstxzvfplveyz (secondaire, pas utilisé par l'app) a des données de test laissées — pas urgent, pas important
- Édition projets : personne n'a can_edit_projects sauf admins — à clarifier si besoin

## Key Context
- **2 projets Supabase** : tbuqctfgjjxnevmsvucl (= le VRAI, utilisé par l'app via .env), wftozvnvstxzvfplveyz (= secondaire, accessible via MCP)
- **Service role key** dans .env permet de contourner RLS via curl PostgREST
- **Vercel** : compte lyestriki-1222, projet crm-v2s-projects/crm-propulseo
- **Dashboard V2** KPI lisent accounting_entries (revenue_category : site_internet/erp/communication) pour CA année en cours + projects_v2 pour count projets actifs
- **Permissions** : 15 flags can_view_*, bypass total si role='admin'
