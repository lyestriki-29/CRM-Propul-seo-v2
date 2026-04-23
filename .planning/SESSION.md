# Session State — 2026-04-23 18:30

## Branch
main

## Completed This Session
- Onglet Suivi du dossier : Suivi mis en premier (par défaut) dans Échanges
- Fix mise en forme notes suivi : ajout `whitespace-pre-wrap break-words` (retours à la ligne préservés)
- Nouveau composant ProjectBriefDocs.tsx : sous-onglets Brief client / Documents
- Ajout onglet "Brief & docs" dans ProjectDetailsTabsV2 (entre Production et Finances)
- Fix bug upload Documents : retiré champs inexistants (`source`, `gmail_metadata`), ajout upload Storage réel (bucket `project-documents`, URL signée 60s)
- Migration créée : supabase/migrations/20260422_project_documents_bucket.sql

## Next Task
**⚠️ Migration bucket PAS encore appliquée sur Supabase** — à faire avant de tester l'upload doc :
1. Appliquer la migration `20260422_project_documents_bucket.sql` via SQL Editor Supabase (ou créer bucket `project-documents` via UI : privé, 50MB)
2. Tester upload/download/suppression depuis l'onglet Brief & docs > Documents
3. Vérifier le sous-onglet Brief client fonctionne (useBriefV2)

## Blockers
- Bucket Storage `project-documents` à créer sur Supabase (tbuqctfgjjxnevmsvucl)

## Key Context
- Onglets V2 Projet : Synthèse / Production / **Brief & docs** (NEW) / Finances / Échanges
- Table `project_documents_v2` n'a PAS de colonne `source` ni `gmail_metadata` — ne jamais les insérer
- Download utilise `supabase.storage.createSignedUrl(path, 60)` car bucket privé
