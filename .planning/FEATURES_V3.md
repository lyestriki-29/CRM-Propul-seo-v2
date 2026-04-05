# FEATURES_V3.md — Propul'SEO CRM
## Nouvelles fonctionnalités à implémenter

**Stack** : Next.js 14 (App Router) · Supabase (PostgreSQL + RLS) · TypeScript · Tailwind CSS  
**Contexte** : Extension du CRM interne Propul'SEO V2. Kanban 9 colonnes, fiches projet 7 onglets, intégration Gmail OAuth, Claude API déjà configurée, Pappers API disponible.

---

## FEATURE 1 — Résumé IA automatique de la fiche client

### Objectif
Bouton "Résumer" sur chaque fiche projet qui génère en 3 lignes un résumé de l'état du projet à partir des données existantes (journal, checklist, statut, budget, brief).

### Comportement attendu
- Bouton "Résumer avec IA" visible dans l'onglet **Vue d'ensemble** de la fiche projet
- Au clic : appel Claude API (`claude-sonnet-4-5`) avec le contexte du projet
- Affichage du résumé dans une card dédiée sous les métriques principales
- Format du résumé : 3 blocs distincts
  1. **Situation actuelle** — dernier échange + statut courant
  2. **Action en cours** — ce qui est en train d'être fait
  3. **Prochain jalon** — prochaine échéance ou livrable attendu
- Le résumé est persisté en base (champ `ai_summary` sur la table `projects`) avec un timestamp
- Badge "Généré il y a Xh" affiché sous le résumé
- Bouton "Régénérer" visible si le résumé date de plus de 24h

### Données injectées dans le prompt Claude
```
- Nom du projet, type de prestation, statut Kanban actuel
- Date de début, date de livraison cible
- Budget total, montant encaissé, statut facturation
- Score de complétude actuel (%)
- Les 5 dernières entrées du journal (type + contenu + date)
- Checklist : phases complétées vs en cours
- Champ "prochaine action" (voir Feature 2)
```

### Prompt système à utiliser
```
Tu es l'assistant CRM de l'agence Propul'SEO. 
À partir des données d'un projet client, génère un résumé factuel et concis en français.
Réponds UNIQUEMENT en JSON avec ce format exact :
{
  "situation": "...",
  "action_en_cours": "...",
  "prochain_jalon": "..."
}
Chaque valeur : 1 phrase max, 20 mots max. Ton neutre et professionnel.
Ne jamais inventer d'information non présente dans les données.
```

### Schema Supabase
```sql
-- Ajouter à la table projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_summary JSONB;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_summary_generated_at TIMESTAMPTZ;
```

### API Route
`POST /api/projects/[id]/summarize`
- Récupère toutes les données du projet via Supabase
- Construit le prompt avec les données
- Appelle `anthropic.messages.create()`
- Parse le JSON retourné
- Persiste dans `projects.ai_summary` + `ai_summary_generated_at`
- Retourne le résumé au client

### UI
- Card avec fond `bg-blue-50` border `border-blue-200`
- 3 sections avec icône + label + texte
- Skeleton loader pendant la génération
- Gestion d'erreur : toast si l'API Claude échoue

---

## FEATURE 2 — Prochaine action visible sur la carte Kanban

### Objectif
Champ "Prochaine action" + date limite visible directement sur les cartes Kanban, sans avoir à ouvrir la fiche projet.

### Comportement attendu
- Nouveau champ saisi dans l'onglet **Vue d'ensemble** de la fiche projet :
  - `next_action_label` : texte libre (ex : "Envoyer maquettes v2")
  - `next_action_due` : date (date picker)
- Ces deux champs s'affichent en bas de chaque carte Kanban
- Couleur de la date selon l'état :
  - Vert : échéance > 3 jours
  - Orange : échéance dans 1-3 jours
  - Rouge : échéance dépassée ou aujourd'hui
- Si pas de prochaine action définie : afficher "— Aucune action définie" en gris
- Cliquer sur la date depuis la carte ouvre directement la fiche projet sur Vue d'ensemble

### Schema Supabase
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS next_action_label TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS next_action_due DATE;
```

### Logique de couleur (utilitaire TypeScript)
```typescript
export function getActionDueColor(due: string | null): string {
  if (!due) return 'text-muted-foreground';
  const days = differenceInDays(new Date(due), new Date());
  if (days < 0) return 'text-red-600 bg-red-50';
  if (days <= 3) return 'text-amber-600 bg-amber-50';
  return 'text-green-700 bg-green-50';
}
```

### Modifications Kanban
- `KanbanCard` component : ajouter une section en bas de carte
- Hauteur de carte augmentée de ~28px pour accueillir le champ
- Inline edit possible : double-cliquer sur le label de l'action depuis la carte ouvre un popover d'édition rapide (input text + date picker + bouton Enregistrer)

---

## FEATURE 3 — Mini-portail client (lecture seule)

### Objectif
Une URL unique par projet, partageable au client sans création de compte, affichant l'état du projet en lecture seule.

### Comportement attendu
- Bouton "Partager avec le client" dans la fiche projet (onglet Vue d'ensemble)
- Génère un token UUID unique (`portal_token`) stocké en base
- L'URL publique : `https://[domaine]/portal/[portal_token]`
- Page accessible sans authentification
- Le client voit :
  1. **Statut du projet** — position dans le pipeline Kanban (barre de progression visuelle sur les 9 étapes)
  2. **Score de complétude** — jauge circulaire
  3. **Prochaine action** — champ Feature 2
  4. **Jalons** — checklist simplifiée (phases uniquement, pas les sous-tâches)
  5. **Documents partagés** — uniquement les docs marqués `is_client_visible = true`
  6. **Factures** — statut + montant (brouillon masqué, seulement Envoyé/Payé)
- Ce que le client NE voit PAS : journal interne, accès/credentials, notes internes, budget détaillé
- Bouton "Désactiver le lien" pour révoquer l'accès

### Schema Supabase
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS portal_token UUID DEFAULT gen_random_uuid();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS portal_enabled BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS portal_enabled_at TIMESTAMPTZ;

-- Marquer les documents visibles client
ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_client_visible BOOLEAN DEFAULT false;
```

### RLS Supabase
```sql
-- Politique lecture publique via token (pas d'auth requise)
CREATE POLICY "portal_read_by_token"
ON projects FOR SELECT
USING (
  portal_enabled = true
  AND portal_token = current_setting('app.portal_token', true)::uuid
);
```

### Route Next.js
- `app/portal/[token]/page.tsx` — Server Component
- Requête Supabase avec `set_config('app.portal_token', token)`
- Si projet non trouvé ou `portal_enabled = false` → page 404 sobre
- Metadata dynamique : `<title>[Nom projet] — Suivi Propul'SEO</title>`
- Design épuré, branding Propul'SEO, pas de navigation CRM

### Sécurité
- Rate limiting sur la route `/portal/[token]` : 60 req/min max (middleware Next.js)
- Pas de données sensibles dans le HTML (credentials, emails internes, notes privées)
- Le token est un UUID v4 — non devinable

---

## FEATURE 4 — Enrichissement SIRET automatique à la création

### Objectif
À la création d'un projet, si un SIRET est saisi, enrichir automatiquement la fiche avec les données Pappers API sans action manuelle.

### Comportement attendu
- Dans le formulaire de création de projet : champ SIRET (14 chiffres, validation format)
- Dès que le champ SIRET est rempli (onBlur ou après 14 chiffres saisis) :
  - Appel Pappers API en arrière-plan
  - Pré-remplissage automatique des champs :
    - Nom de l'entreprise
    - Adresse
    - Code NAF / secteur d'activité
    - Forme juridique
    - Dirigeant principal (nom + prénom)
    - Date de création
    - Effectif approximatif
  - Badge "Données enrichies via Pappers" affiché sous les champs pré-remplis
- L'utilisateur peut modifier manuellement chaque champ pré-rempli
- Si le SIRET n'est pas trouvé : message d'erreur inline discret, les champs restent éditables

### Schema Supabase
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS siret VARCHAR(14);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_data JSONB; 
-- Stocke la réponse brute Pappers pour référence future
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_enriched_at TIMESTAMPTZ;
```

### API Route
`GET /api/pappers/enrich?siret=[siret]`
- Côté serveur uniquement (clé Pappers dans les variables d'environnement)
- Appelle `https://api.pappers.fr/v2/entreprise?siret=[siret]&api_token=[PAPPERS_API_KEY]`
- Retourne un objet normalisé :
```typescript
interface CompanyData {
  nom_entreprise: string;
  adresse: string;
  code_naf: string;
  secteur: string;
  forme_juridique: string;
  dirigeant: string;
  date_creation: string;
  effectif: string;
}
```
- Stocker `company_data` (réponse brute) dans le projet pour traçabilité

### Variables d'environnement à ajouter
```
PAPPERS_API_KEY=your_key_here
```

---

## FEATURE 5 — Automatisation "Changement de statut" → actions

### Objectif
Déclencher automatiquement des actions prédéfinies quand une carte Kanban change de colonne.

### Règles d'automatisation (non configurables dans cette version — hardcodées)

| De | Vers | Actions déclenchées |
|---|---|---|
| Brief | Devis | Créer tâche checklist : "Envoyer devis" (phase Onboarding) |
| Devis | En cours | Créer tâche : "Kick-off planifié" · Entrée Journal type Statut : "Projet démarré" |
| En cours | Recette | Créer tâche : "Envoyer livrable pour recette" · Notif interne |
| Recette | Livré | Créer tâche : "Demander validation écrite" · Entrée Journal : "Livraison effectuée" · Email template client (optionnel) |
| Livré | Clôturé | Créer tâche : "Vérifier encaissement" · Entrée Journal : "Projet clôturé" · Mettre score complétude en lecture seule |
| * | En pause | Entrée Journal : "Projet mis en pause" + date |

### Implémentation
- Fonction `triggerStatusAutomations(projectId, fromStatus, toStatus)` appelée dans le handler de drag & drop Kanban
- Les tâches créées sont ajoutées à la checklist du projet dans la phase correspondante
- Les entrées Journal sont de type `system` (pas `manual`) — affichées différemment dans l'UI (fond gris, icône automatisation)
- Toutes les automatisations sont loggées dans une table `automation_logs` pour audit

### Schema Supabase
```sql
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  trigger_type VARCHAR(50) NOT NULL, -- 'status_change'
  from_value TEXT,
  to_value TEXT,
  actions_executed JSONB, -- liste des actions déclenchées
  executed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## FEATURE 6 — Vue "Mois en cours" : tableau de bord simplifié

### Objectif
Un écran d'accueil ou une page dédiée affichant 3 métriques clés du mois en cours + les projets urgents.

### Comportement attendu
Accessible depuis la navigation principale : icône dashboard ou lien "Ce mois-ci"

**Bloc 1 — Métriques financières du mois**
- CA encaissé ce mois (somme des factures `status = 'paid'` et `paid_at` dans le mois courant)
- CA en attente (factures `status = 'sent'` tous projets actifs)
- CA total facturé ce mois (paid + sent)
- Comparaison vs mois précédent : flèche + pourcentage

**Bloc 2 — Projets à livrer dans 14 jours**
- Liste des projets avec `statut IN ('En cours', 'Recette')` et `delivery_date <= now() + 14 days`
- Triés par date de livraison croissante
- Badge rouge si `delivery_date < now()` (en retard)
- Clic → ouvre la fiche projet

**Bloc 3 — Projets sans activité récente**
- Projets `statut IN ('En cours', 'Recette', 'Maintenance')` sans entrée journal depuis 7 jours
- Signal d'alerte : "X projets inactifs"
- Clic → ouvre la fiche projet

**Bloc 4 — Score d'activité équipe**
- Nombre de notes ajoutées ce mois (toi + Etienne)
- Répartition par type (appel / email / réunion / système)

### Requêtes Supabase clés
```typescript
// CA encaissé ce mois
const { data: paid } = await supabase
  .from('invoices')
  .select('amount')
  .eq('status', 'paid')
  .gte('paid_at', startOfMonth(new Date()).toISOString())
  .lte('paid_at', endOfMonth(new Date()).toISOString());

// Projets à livrer dans 14j
const { data: urgent } = await supabase
  .from('projects')
  .select('id, name, delivery_date, status, completion_score')
  .in('status', ['En cours', 'Recette'])
  .lte('delivery_date', add(new Date(), { days: 14 }).toISOString())
  .order('delivery_date', { ascending: true });

// Projets sans activité
const { data: inactive } = await supabase
  .from('projects')
  .select('id, name, status')
  .in('status', ['En cours', 'Recette', 'Maintenance'])
  .not('id', 'in', 
    supabase.from('journal_entries')
      .select('project_id')
      .gte('created_at', subDays(new Date(), 7).toISOString())
  );
```

### UI
- Page `/dashboard` ou écran d'accueil remplacé par cette vue
- 4 metric cards en haut (CA encaissé, CA en attente, projets urgents, projets inactifs)
- 2 colonnes en dessous : "À livrer bientôt" | "Sans activité"
- Bouton refresh manuel + refresh automatique toutes les 5 min
- Design sobre : pas de graphiques complexes, juste les chiffres qui comptent

---

## Ordre d'implémentation recommandé

| Sprint | Features | Justification |
|---|---|---|
| Sprint 1 | Feature 2 (prochaine action) + Feature 5 (automatisations) | Pas de dépendances externes, impact immédiat sur l'usage quotidien |
| Sprint 2 | Feature 4 (SIRET / Pappers) + Feature 6 (dashboard mois) | Requêtes API simples, SQL straightforward |
| Sprint 3 | Feature 1 (résumé IA) | Dépend des données accumulées en Sprint 1-2 pour être pertinent |
| Sprint 4 | Feature 3 (portail client) | Plus de complexité RLS + design client-facing |

---

## Variables d'environnement nécessaires

```env
# Déjà existantes (V2)
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Nouvelles (V3)
PAPPERS_API_KEY=          # Feature 4
NEXT_PUBLIC_APP_URL=      # Feature 3 — pour construire les URLs portail
```

---

## Notes pour Claude Code

- Toutes les nouvelles colonnes Supabase doivent être ajoutées via des migrations versionnées dans `/supabase/migrations/`
- Les appels Claude API se font côté serveur uniquement (API Routes ou Server Actions), jamais côté client
- Les types TypeScript des nouvelles colonnes doivent être régénérés après chaque migration (`supabase gen types typescript`)
- Le portail client (Feature 3) est une route publique — s'assurer qu'aucun middleware d'auth ne l'intercepte
- Les automatisations (Feature 5) doivent être idempotentes : si le drag & drop est annulé, rollback propre
