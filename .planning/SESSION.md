# Session State — 2026-04-05 02:30

## Branch
main

## Completed This Session
- Sprint 4 Feature 3 : Mini-portail client lecture seule (6 tâches)
- Migration SQL : portal_token (UUID) + portal_enabled (BOOLEAN) + RLS anon sur projects_v2, checklist_items_v2, project_invoices_v2
- Types : ProjectV2 mis à jour avec portal_token + portal_enabled
- App.tsx : détection /portal/:token avant le Layout authentifié (lazy load)
- Hook useClientPortal : fetchPortalData (anon), generateToken, revokeToken
- ClientPortalPage : page publique light mode — statut, progression, checklist, factures
- SharePortalButton : bouton dans ProjectOverview — génère, copie, révoque

## Next Task
Sprint 5 — à définir (relire ROADMAP_V3.md)
- La migration SQL (portal_token) doit être appliquée manuellement via Supabase Dashboard (SQL Editor)
- Tester end-to-end : générer un token → copier l'URL → ouvrir en navigation privée

## Blockers
- Migration 20260406_add_portal_token.sql non encore appliquée en base (à faire manuellement via dashboard)
- PAPPERS_API_KEY toujours en attente (Sprint 2)

## Key Context
- Commits Sprint 4 : ef78639 → 3840563 (8 commits)
- `LinkOff` n'existe pas dans lucide-react installé → utiliser `Link2Off`
- Supabase anon client : utiliser isDemoMode depuis @/lib/supabase pour guard les env vars
- Repo GitHub : https://github.com/lyestriki-29/CRM-Propul-seo-v2.git (branch main)
