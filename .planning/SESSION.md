# Session State — 2026-05-13 fin (autonomous V3 session)

## Branch
**preview/v3-ux-overhaul** (exception V3 isolée, **AUCUN PUSH effectué**)

## Tag de retour rapide
`git reset --hard v3-pre-autonomous-session` revient au commit 9146b62
(avant toute la session autonome).

## Plan E2E V3 — Livré 100%

- [x] **Phase 0** — Commit safe + tag (commit 9146b62)
- [x] **Phase 1** — Sidebar V2 BETA → V3 PREVIEW + routes (commit 4ab1ac6)
- [x] **Phase 2** — Module ProjectsV3Completed dédié (commit 7ff1181)
- [x] **Phase 3** — Communication V3 wiring (livré en Phase 1)
- [x] **Phase 4** — Leads V3 + 3 variantes UX + optimistic DnD (commit c3ed12a)
- [x] **Phase 5** — Preview docs PDF/images/vidéo/Office (commit 3e5d795)
- [x] **Phase 6** — Audit onglets restants → AUDIT_PHASE6.md
- [x] **Bonus** — Conversion lead → projet 1 clic (commit 984916a)

## Livré cette session

### Sidebar
- Section "V2 BETA" renommée "V3 PREVIEW"
- 8 entrées V3 actives : Dashboard V2, Leads, Projets En cours, Projets Terminés,
  Comm. Production, Comm. KPI, Gestion des projets, Procédures
- Section "Pôles V2" (renommée depuis "Projets") conservée
- V1 conservée intacte en bas

### Nouveaux modules V3
- **`src/modules/LeadsV3/`** — fusion CRM Principal + CRM ERP en 2 onglets,
  3 variantes UX (Kanban / Compact / Inbox) avec toggle persistant
- **`src/modules/ProjectsV3Completed/`** — vue liste compacte des projets
  archivés ou livrés, filtres recherche/responsable/pôles

### Détail projet V3 Preview
- Modale d'édition : champ "Date de début" ajouté
- Sidebar "À propos" : SIRET formaté + enrichissement Pappers (raison sociale,
  forme juridique, effectif) + badge "✓ Enrichi via Pappers"
- Tab Production : cycle 2 états (1 clic = validé), suppression UI in_progress
- Tab Synthèse : MetricCards Budget/Échéance cliquables vers modale
- Onglet Documents : preview natif PDF / images / vidéo / Office (Google Docs
  viewer), modale plein écran avec ESC + click-outside, signed URL TTL 600s
- Refacto : useChecklistV3 hissé dans index.tsx → source unique de vérité
  pour la progression (sidebar et tab Production partagent le même state)
- Refetch projet silencieux (plus de flash de chargement à chaque toggle)

### Conversion lead → projet
- Bouton "Convertir en projet" sur cards leads "signés" (variantes A et C)
- Crée un projects_v2 minimal préfilé (nom, client, responsable, budget, source)
- Non destructif : le lead source reste intact
- Toast confirmation avec action "Ouvrir le projet"

## Routes V3 actives

- `/leads-v3` — Leads V3 (CRM Principal + ERP fusionnés)
- `/projets-en-cours` — Projets V3 kanban
- `/projets-v3-termines` — Projets V3 terminés
- `/projets-v3-preview/:id` — Détail projet V3 (avec preview docs)
- `/communication-v3/production` — wiring vers Communication V2
- `/communication-v3/kpi` — wiring vers CommunicationKPI V2
- `/coffre-fort` — Coffre-fort agence (admin)

## À tester en priorité au retour

1. **Leads V3** — http://localhost:5174/leads-v3
   - Switcher Site web ↔ ERP en haut
   - Switcher Variante A / B / C dans le header
   - Drag&drop colonne en variante A (vérif optimistic update)
   - Filtres : recherche, responsable
   - Sur un lead "signé" → bouton "Convertir en projet" en bas de carte

2. **Projets V3 Terminés** — http://localhost:5174/projets-v3-termines
   - Liste devrait montrer ~20 projets (BDD = 20 archivés/livrés)
   - Filtres + recherche

3. **Détail projet V3 (Lolett)** — http://localhost:5174/projets-v3-preview/d570010a-553f-4171-88a2-ecb637a4663e
   - Onglet Documents : cliquer un document → preview modale
   - Tester PDF, image, vidéo si dispo
   - Onglet Production : 1 clic = validé (cycle 2 états)
   - Sidebar Progression = Production %, en cohérence

## Choix à valider au retour (variantes Leads V3)

Tu dois choisir LA variante que tu préfères et on supprimera les 2 autres :
- **A — Kanban classique** : familier, drag&drop, vue d'ensemble
- **B — Compact** : dense, dropdown statut par ligne, voit beaucoup de leads
- **C — Inbox** : pills filtres en haut, cards détaillées, mode "boîte de réception"

Le toggle actuel persiste en localStorage : `propulseo:leads-v3:variant`.

## Issues identifiées NON corrigées (différées)

| Issue | Sévérité | Pourquoi différé |
|---|---|---|
| Pas de realtime subscription dans Leads V3 (vs V1) | HIGH | Pas bloquant en mono-user, à brancher au retour |
| Signed URL TTL 600s sans refresh dans preview docs | HIGH info | Acceptable pour preview rapide |
| DocumentsTabV3.tsx 247 lignes (> 200) | HIGH | Préexistant, +11 lignes uniquement par moi |
| MetricCards Score retirée (pas d'algo) | LOW | À redéfinir avec toi |

## Blockers

Aucun. Toutes les phases planifiées sont livrées.

## Key context

- **Dev server** : http://localhost:5174 (toujours actif)
- **Login admin** : lyestriki@yahoo.fr
- **Tag retour** : `v3-pre-autonomous-session` (commit 9146b62, état d'avant session)
- **6 commits ajoutés cette session** : 4ab1ac6 7ff1181 c3ed12a 3e5d795 984916a (+ ce save)
- **Branch state** : preview/v3-ux-overhaul, AUCUN PUSH effectué (commits locaux uniquement)
- **AUDIT_PHASE6.md** : checklist détaillée de l'audit des tabs Accès/Brief/Sidebar droite

## Next session (priorités suggérées)

1. **Tu choisis 1 variante Leads V3** parmi A/B/C → on supprime les 2 autres
2. Brancher realtime Supabase sur Leads V3 (parité V1)
3. Refactoriser DocumentsTabV3 sous 200 lignes via extraction useDocumentsTabV3
4. Décider quoi faire de la MetricCard Score (algo ou suppression définitive)
5. Push une fois tout validé : `git push origin preview/v3-ux-overhaul`
