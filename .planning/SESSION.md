# Session State — 2026-04-05 23:00

## Branch
main

## Completed This Session
- Fix CORS gmail-sync : ajout CORS_HEADERS + gestion OPTIONS → edge function v15 déployée
- Migration DB : schéma complet (49 tables V1 + 12 V2) appliqué sur nouveau projet Supabase
- Migration données : 13 crmerp_leads migrés depuis ancienne DB (tbuqctfgjjxnevmsvucl)
- Projet Lolett (projects_v2) conservé intact dans nouveau projet

## Next Task
Tester l'app en prod : vérifier que toutes les features fonctionnent avec le nouveau schéma complet (contacts, crmerp, chat, communication, tâches). Commencer par ouvrir chaque module et vérifier qu'il charge sans erreur 404/RLS.

## Blockers
Users non migrés — les users de l'ancienne DB ne peuvent pas être copiés (auth_user_id lié à l'ancien projet Supabase). Ils devront se reconnecter sur le nouveau projet → trigger handle_new_user les crée automatiquement.

## Key Context
- Nouveau projet Supabase : wftozvnvstxzvfplveyz (eu-west-1)
- Ancienne DB source : tbuqctfgjjxnevmsvucl (compte différent, service role key dans historique de conversation)
- gmail-sync v15 déployée avec CORS headers — l'erreur réseau était due à l'absence de Access-Control-Allow-Origin dans les réponses
- init_new_project.sql généré dans supabase/ (à supprimer ou archiver, ne pas rejouer)
- RLS non configurée sur les nouvelles tables V1 — à faire si besoin de sécurité multi-user
