# Session State — 2026-04-25 (fin)

## Branch
main

## Completed This Session
- Nouveau module **Procédures** (wiki interne SOP) — `src/modules/ProceduresManager/`
- Migration `20260424_procedures_module.sql` : tables `procedures` + `procedure_categories` + `procedure_revisions`, bucket Storage `procedure-assets`, RPC FTS, trigger historique, RLS
- Fix FTS index : wrapper `procedures_fts_vector()` IMMUTABLE (évite 42P17)
- Éditeur TipTap complet (toolbar + upload image + storagePath persistent + re-signature au render)
- Code review auto : fixes P0 (SVG XSS retiré, URLs signées expirant 1h → pipeline storagePath) + P1 (editor.destroy)
- Seed fiche "Acheter un nom de domaine sur Namecheap" (`20260425_seed_procedure_namecheap.sql`)
- Les 3 migrations appliquées sur prod `tbuqctfgjjxnevmsvucl` (après erreur initiale sur le mauvais projet)

## Next Task
Tester le module en UI : Sidebar V2 → Procédures → voir fiche Namecheap, éditer, upload image, vérifier historique.

## Blockers
Aucun. Tout est déployé.

## Key Context
- Tables sans suffixe `_v2` (nouveau module, pas de legacy) → accès direct `supabase.from('procedures')`.
- Images TipTap : `src = signedUrl temp` + `storagePath = path Storage`. Serialize au save, resolve au render via `useResolvedContent`.
- User a 2 Supabase : perso `wftozvnvstxzvfplveyz` (à nettoyer si besoin) et team `tbuqctfgjjxnevmsvucl` (prod app).
- Dev server toujours UP sur :5173 et :5174.
