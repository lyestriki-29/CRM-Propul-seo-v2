# Session State — 2026-04-16 21:00

## Branch
main

## Completed This Session
- Sprint 3-5 : 12 hooks V2, migrations SQL, edge functions migrées, cleanup
- SiteWebManager + ERPManager : 4 vues (Pipeline/Projets/Mois/Semaine) avec TaskBoard
- Header aligné (onglets centrés), Kanban grid sans scroll, ERP mode Hubspot direct
- 3 previews HTML de la refonte fiche projet créées dans public/preview/

## Next Task
1. Valider le design de la refonte fiche projet : ouvrir http://localhost:3001/preview/ et choisir entre V1 (cards), V2 (flush) ou V3 (grille 2 colonnes)
2. Une fois le design choisi, créer le plan d'implémentation puis implémenter la refonte de ProjectDetailsV2 (7 onglets → 4 onglets + sidebars repliables)

## Blockers
None

## Key Context
- Previews : `public/preview/` (index.html, v1-cards.html, v2-flush.html, v3-grid.html)
- Design validé : 4 onglets (Synthèse/Production/Finances/Échanges) + sidebars repliables
- Plan détaillé : `.claude/plans/cuddly-tinkering-melody.md`
- Lancer `npm run dev -- --port 3001` pour voir les previews
