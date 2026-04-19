# Session State — 2026-04-19 18:00

## Branch
main

## Completed This Session
- Lien portail : URL affichée dans SharePortalButton après génération
- Follow-ups Synthèse : nouveau composant SyntheseFollowUpPreview intégré dans SyntheseTab
- Gmail light : ProjectEmailRules intégré dans onglet Échanges
- Sélecteur phase : ProjectStatusSelector + sync kanban (refetch onBack) dans 3 modules
- Budget billing : ProjectBilling reçoit project, affiche budget vs facturé, alerte dépassement
- Fix template : bulk insert addItems + sort_order (pas position) + async applyTemplate
- Fix coffre-fort : hook réécrit avec select('*'), vrais noms colonnes (label pas service_name)
- Fix crash Dashboard : ai_summary!. → ai_summary?. dans AiSummariesSection + Widget

## Next Task
Tester les 7 features dans le navigateur : coffre-fort, template, sélecteur phase, finances, Gmail, suivi synthèse, lien portail

## Blockers
- Résumé IA : Edge Function generate-ai-summary non déployée (pas un bug code)
- Projets avec status générique (in_progress) invisibles sur kanban module-spécifique

## Key Context
- Table project_accesses_v2 : colonnes = label (PAS service_name), login/password/notes en TEXT clair, provided_by et expires_at existent
- Table checklist_items_v2 : colonne sort_order (PAS position), status CHECK n'inclut pas 'skipped'
- 9 projets de test à supprimer en DB (client_name vide ou "test")
