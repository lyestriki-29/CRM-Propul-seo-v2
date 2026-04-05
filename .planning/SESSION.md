# Session State — 2026-04-05 23:59

## Branch
main

## Completed This Session
- Sprint 3 Feature 1 : Résumé IA automatique de la fiche client (6 tasks)
- Migration : ai_summary (JSONB) + ai_summary_generated_at (TIMESTAMPTZ) sur projects_v2
- Edge Function generate-ai-summary : collecte données, Claude Sonnet 4.6, persiste JSONB
- Hook useAiSummary + composant AiSummaryCard (3 blocs, skeleton, regen, badge âge)
- Intégration dans ProjectOverview via ProjectDetailsTabsV2.refetch

## Next Task
Sprint 4 — Feature 3 (Mini-portail client lecture seule)
- Lire ROADMAP_V3.md section Sprint 4 avant de planifier
- Bouton "Partager avec le client" → token UUID
- URL publique /portal/[token] (sans auth)
- RLS Supabase avec portal_token + portal_enabled
- Contenu : statut, score, prochaine action, checklist simplifiée, factures

## Blockers
- PAPPERS_API_KEY non encore configurée dans Supabase env (Sprint 2, toujours en attente)
- Edge Function generate-ai-summary déployée via CLI impossible (403 permissions) — déployer via dashboard Supabase

## Key Context
- Repo GitHub : https://github.com/lyestriki-29/CRM-Propul-seo-v2.git (branch main)
- Projet Supabase : wftozvnvstxzvfplveyz
- Commits Sprint 3 : fbecd3a → d70a64b (8 commits)
- ANTHROPIC_API_KEY déjà présente côté Supabase
- Erreurs TS pré-existantes dans le projet (ActivityCard, UserSelector) — ne pas confondre avec les nôtres
