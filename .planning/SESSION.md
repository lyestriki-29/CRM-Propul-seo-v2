# Session State — 2026-04-09 22:00

## Branch
main

## Completed This Session
- Exploration V2 Beta: cartographie complète des modules (kanban, fiche 7 onglets, dashboard, mois en cours)
- Brainstorm entamé: identification des besoins d'évolution du CRM V2

## Next Task
Brainstorm complet sur les 3 types de prestation (Web, ERP, Accompagnement Communication) à partir des plaquettes Propulseo envoyées par l'utilisateur. Définir : checklists par type, champs personnalisés par prestation, puis rédiger le spec design doc.

## Blockers
Attente des 3 plaquettes commerciales Propulseo pour cadrer les besoins précis

## Key Context
- V2 Beta sidebar : Dashboard V2, Projets V2 (kanban 9 col), Mois en cours
- Table Supabase : `projects_v2` — déjà branchée, presta_type actuel = web/seo/erp/saas
- Décisions actées : remplacer par 3 types = Web / ERP / Accompagnement Communication
- Kanban commun avec filtres par utilisateur ET par presta type
- Plusieurs onglets fiche projet encore en mocks (checklist, journal, facturation, suivi, brief)
- Priorité : ajouter fonctionnalités manquantes AVANT de brancher les mocks sur Supabase
