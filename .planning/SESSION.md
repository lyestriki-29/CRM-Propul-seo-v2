# Session State — 2026-04-12 16:00

## Branch
main

## Completed This Session
- Sidebar : section "En cours" (Communication, ERP, Site Web) + "Projets V2" → "Gestion des projets" (2e position)
- LoginPage : page login dark violet avec logo Propulseo, email/mdp, branché sur Supabase Auth
- App.tsx : suppression dev-user hardcodé, flux spinner → login → CRM selon session
- Compte admin@propulseo.com créé via MCP Supabase (role admin, tous droits)
- Fix login : champs NULL (email_change, phone…) → chaînes vides pour GoTrue

## Next Task
Aucune tâche en cours — login fonctionnel, sidebar réorganisée, tout pushé

## Blockers
None

## Key Context
- Login : admin@propulseo.com / Roadto100K (compte Supabase projet wftozvnvstxzvfplveyz)
- Sidebar sections : "✦ V2 Beta" (Dashboard V2, Gestion des projets, Mois en cours) + "En cours" (Communication, ERP, Site Web)
- GoTrue bug : insérer manuellement dans auth.users nécessite email_change='' + phone='' (pas NULL)
