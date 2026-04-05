# Session State — 2026-04-06 17:30

## Branch
main

## Completed This Session
- ContactCard sidebar: `ProjectV2RightSidebar.tsx` + `useProjectClient.ts` — fiche client avec tel/email copiables
- Activity tracker (overview): `ProjectOverview.tsx` — cartes cliquables/dépliables par type (email/appel/RDV/tâche/note)
- Détails riches: email corps+PJ téléchargeables, RDV date/lieu/participants, appel direction+durée, tâche statut+échéance
- Filtres par type dans l'en-tête du tracker

## Next Task
Aucune tâche définie — demander à l'utilisateur quoi faire ensuite sur ProjectDetailsV2 ou autre module

## Blockers
None

## Key Context
- `ProjectActivity.metadata` est `Record<string, unknown>` → toujours caster avec `as` ou `!!` avant usage JSX pour éviter TS2322
- `useActivitiesV2(project.id)` retourne `{activities, loading, addActivity}` depuis table `project_activities_v2`
- `useProjectClient(clientId)` dans `hooks/useProjectClient.ts` — nouveau hook, requête table `clients`
- Build passe avec `✓` malgré des erreurs TS pre-existantes dans d'autres fichiers (UserSelector, ActivityCard, etc.)
- Nouveau projet Supabase : wftozvnvstxzvfplveyz (eu-west-1)
