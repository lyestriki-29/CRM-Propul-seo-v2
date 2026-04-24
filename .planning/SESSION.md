# Session State — 2026-04-25 (fin 2)

## Branch
main

## Completed This Session
- Seed batch 1 : 15 nouvelles fiches wiki (Dev Claude Code/MCP/PRD, Commercial onboarding/devis, Web Cloudflare/OVH/WordPress, Email Workspace, SEO GSC/audit, Design Figma, Admin team/clôture)
- UI : refonte landing en grille de **dossiers** (CategoryFolder.tsx) avec drill-down catégorie. Chips/tags/recherche restent
- Fix critique : apostrophes doubles (`l''essai`) → simples dans les JSON dollar-quoted
- Réécriture pédagogique des 16 fiches : jargon défini au premier usage, encadrés 💡⚠️✅, code blocks, analogies (DNS = annuaire internet, etc.)
- 3 migrations appliquées sur prod `tbuqctfgjjxnevmsvucl` : seed batch1, vue dossiers (frontend only), rewrite_pedagogique

## Next Task
**Audit qualité des 16 fiches** dans l'app (http://localhost:5174 → V2 → Procédures). Pour chaque fiche : vérifier que le ton est OK pour un néophyte, pas de jargon non expliqué, encadrés bien rendus. Lister les retouches à faire et patcher avec une nouvelle migration UPDATE par slug.

## Blockers
Aucun.

## Key Context
- Apostrophes : dans JSON dollar-quoted `$jsonb$...$jsonb$` → simples (`l'essai`). Dans `content_text` single-quoted SQL → doubles (`l''essai`).
- Trigger `log_procedure_revision` archive auto chaque UPDATE → historique consultable via icône 🕒.
- Module accessible via `can_view_procedures` (default true sur tous users).
- 2 Supabase : perso `wftozvnvstxzvfplveyz` (à nettoyer si besoin), team `tbuqctfgjjxnevmsvucl` (prod app, .env).
