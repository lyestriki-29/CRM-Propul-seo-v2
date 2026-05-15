# Session State — 2026-05-15 fin (debug login prod + prep Propulspace)

## Branch
**main** — clean après commit

## Completed cette session
- **Debug login prod KO** : root cause = ancien JWT (signé avec clés legacy désactivées le 2026-05-14T21:22:05) stocké dans localStorage du navigateur. Le client supabase-js le rejouait au WebSocket realtime → 401 sur `/auth/v1/token`. **Fix** = hard refresh navigateur (clear localStorage). Bundle prod + env Coolify étaient à jour avec nouvelles clés `sb_publishable_*`.
- **Refacto `useUsers`** : nouvel export mémoïsé `activeUsers` (filtre `is_active !== false`) consommé par 6 modules V3 (LeadsV3, ProjectsV3, ProjectsV3Completed, ProjectDetailsV3Preview ×2, Communication, CommunicationKPI).
- **PRD Propulspace v2** ajouté dans `Propulspace/` (54 KB EN, prep nouvelle feature).

## Next Task — Démarrer Propulspace
Nouvelle session neuve : lire `Propulspace/PRD_PROPULSPACE_v2_EN.md`, faire un `/brainstorming` pour cadrer l'implémentation avant tout code.

## Blockers
Aucun.

## Key Context
- **Risque rotation clés** : tout user déjà loggé avant le 2026-05-14 a un JWT mort dans son navigateur → `Cmd+Shift+R + Clear site data` pour débloquer. Si plusieurs utilisateurs remontent le souci, ajouter au boot un `supabase.auth.signOut()` automatique sur token invalide.
- Login admin : `lyestriki@yahoo.fr`
- Prod : https://crm.propulseo-site.com (bundle `index-BslcMQYn.js`, healthy)
- Coolify : token dans `.env`, UUID `el094rjbgs6iefsvaws6qs0w`
- Modifs V1/V2 cleanup + Dashboard V3 simplifié = commits `5be7091`, `c319dab`, `27099dc` (déjà push)
