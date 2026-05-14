# Session State — 2026-05-14 fin (V3 live + alerte service_role fuitée)

## Branch
**main** — synchronisée avec origin/main (commit `8fcabff`)

## 🚨 ACTION URGENTE POUR DEMAIN — Fuite service_role_key

### Constat de fin de session
La `SUPABASE_SERVICE_ROLE_KEY` est exposée dans 2 commits GitHub publics :
- `e727d85` feat(kanban): show next_action badge on project cards
- `af1012d` feat(v2): init — suivi refonte, gmail-sync ICS, migrations Supabase

Fichiers concernés :
- `database/diagnostics/diagnostic.js`
- `scripts/test-supabase-connection.js`
- `docs/archive/DEPLOY_ADMIN_UPDATE_PASSWORD.md`
- `docs/runbooks/DEPLOY_ADMIN_UPDATE_PASSWORD.md`
- `next-public/lib/supabase-server.ts`

### Gravité
🔴 **CRITIQUE.** La service_role bypasse TOUTES les RLS qu'on a mises en place hier. Quiconque scrape GitHub peut avoir accès admin total à la BDD.

### Ce qui a été tenté pendant la session
- ❌ Click "Disable JWT-based API keys" sur Supabase → a cassé l'app prod (HTTP 401)
- ✅ Re-enable legacy keys → app prod fonctionne à nouveau
- ❌ Bouton "Rotate JWT secret" introuvable dans l'UI Supabase actuelle

### Plan d'action pour demain (3 options)

**Option A (recommandée) — Migration vers nouvelles "Publishable / Secret API keys"**
1. Supabase Dashboard → Settings → API Keys → onglet "Publishable and secret API keys"
2. Générer 1 publishable + 1 secret (si pas déjà fait)
3. Mettre à jour `.env` local :
   - `VITE_SUPABASE_ANON_KEY=sb_publishable_xxx`
   - `SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx`
4. Mettre à jour Coolify env vars (VITE_SUPABASE_ANON_KEY) + "Available at Buildtime"
5. Redéployer Coolify
6. Tester que l'app marche avec les nouvelles clés
7. Désactiver les "Legacy JWT-based API keys" sur Supabase → l'ancienne service_role fuitée devient invalide

**Option B — Rotation JWT secret classique** (si on retrouve le bouton)
- Settings → JWT Keys → Rotate secret
- Mettre à jour anon dans `.env` + Coolify, redéployer

**Option C — Support Supabase**
- Ticket via dashboard "I need to rotate my service_role key (leaked credential)"
- Réponse < 24h

### Anon key fuitée (moins critique)
Même problème pour l'anon key dans les mêmes fichiers, mais elle est publique par design.
Si rotation JWT effectuée → elle change aussi automatiquement → bénéfice secondaire.

---

## ⚠️ Coolify pas à jour avec le dernier code

Dernier déploiement Coolify Healthy : commit `87e6857` (vers 10h38 UTC).

**Commits poussés sur main NON DÉPLOYÉS** :
- `9628fb1` security RLS (RPC SECURITY DEFINER)
- `9d6c669` fixes review (cleanup useEffect, Array RPC payload)
- `29c8de3` fix CSP nginx (Google Photos)
- `b981cb4` 4 previews dashboard (WIP supprimé ensuite)
- `08628b1` sidebar fixes (path aliases + type User)
- `7339457` session save
- **`8fcabff` DashboardV3 swap (CRITIQUE — l'utilisateur voit encore V2 en prod)**

### Pour redéployer demain
```bash
TOKEN=$(grep "^CoolifyToken=" .env | cut -d'=' -f2-)
curl -X GET "http://146.59.228.186:8000/api/v1/deploy?uuid=el094rjbgs6iefsvaws6qs0w&force=true" \
  -H "Authorization: Bearer $TOKEN"
```

**Ou via UI Coolify** : projet `c-r-m--propul-seo-v2` → Redeploy.

⚠️ **AVANT redeploy** : si tu fais l'Option A des nouvelles clés, mets à jour Coolify env vars d'abord, sinon l'app va casser avec les anciennes clés invalidées.

---

## ✅ Completed cette session (récap)

### V3 finalisation
- Templates production V3 (site_web 18 / erp_v2 17) basés sur projets réels
- Onglet Documents V3 Variante A (dropzone + filtres + liste plate, 5 sous-composants)
- Sidebar V3 PREVIEW réorganisée : Dashboard / Projets / Leads / Comm / Procédures / Terminés
- **DashboardV2 supprimé, DashboardV3 officiel créé** (commit `8fcabff`)
- Migration BDD : 37 anciens projets re-matérialisés avec nouveaux templates
- Merge `preview/v3-ux-overhaul` → main (48 commits, no-ff)

### Sécurité Supabase (énorme chantier)
- **191 findings advisors → 181** (4 ERROR éliminés)
- DROP 3 tables backup avec données sensibles (password)
- RLS activée sur `automation_logs`
- DROP 33 policies "public always-true" sur 16 tables CRM
- CREATE policies `authenticated_all_*`
- DROP 14 policies anon trop larges (portail/brief)
- **CREATE 3 RPC SECURITY DEFINER** (`get_portal_data`, `get_brief_by_short_code`, `upsert_brief_by_short_code`) avec search_path figé + GRANT explicite anon
- Migration frontend `useClientPortal` + `useBriefV2` vers RPC
- 27 tables critiques bloquées en anon (test live confirmé)

### Code review fixes
- Sidebar.tsx : `any` → `User | null`, imports relatifs → path aliases
- nginx.conf : CSP + headers répliqués dans chaque bloc location
- useClientPortal/useBriefV2 : Array RPC payload handling + cleanup useEffect + deps token

### Déploiement Coolify
- Dockerfile multi-stage Node 22 + nginx
- nginx.conf SPA fallback + gzip + CSP
- .dockerignore
- Switch Build Pack Nixpacks → Dockerfile
- Variables env VITE_SUPABASE_* avec Buildtime
- App live sur https://crm.propulseo-site.com

---

## Next Tasks (par priorité)

### 🔴 P0 — Demain matin (CRITIQUE)
1. **Rotater la service_role_key** (Option A migration recommandée)
2. **Mettre à jour `.env` local + Coolify** avec nouvelles clés
3. **Redéployer Coolify** pour avoir le DashboardV3 + tous les fixes
4. **Vérifier** que l'app marche avec les nouvelles clés + nouveau Dashboard visible

### 🟠 P1 — Hardening Supabase (1h)
5. Activer leaked password protection (Auth Settings)
6. Réduire OTP expiry à 600s
7. Restreindre 2 buckets Storage publics (`client-post-assets`, `post-assets`)
8. Retirer 3 materialized views de l'API REST (kpi_*)
9. Upgrade Postgres (version vulnérable)
10. Fix récursion infinie policy `channel_members`

### 🟡 P2 — Polish (différé)
- `Sidebar.tsx` > 200L : extraire NavSection config
- `DocumentsTabV3.tsx` uploader_name hardcodé `'Admin'`
- nginx.conf : CSP sur bloc location SVG
- 5 fichiers V3 > 200L (ProjectEditModalV3, ProductionTabV3, etc.)
- Cleanup 4 fichiers du repo avec anon key hardcodée
- 55 fonctions `search_path` mutable
- 38 fonctions SECURITY DEFINER anon — audit revoke

---

## Blockers
- Rotation service_role bloquée par UI Supabase qui a changé (bouton introuvable)
- Coolify pas à jour avec le dernier DashboardV3

## Key Context
- Branch : **main** (clean, synchronisée)
- Prod : https://crm.propulseo-site.com (legacy keys actives, tourne avec ANCIEN code)
- GitHub : Propul-Seo/CRM-Propul-seo-v2
- Tag safety : `v3-pre-autonomous-session`
- Tests : 124/124 unit
- Coolify : http://146.59.228.186:8000, app UUID `el094rjbgs6iefsvaws6qs0w`
- Token Coolify : dans `.env` (`CoolifyToken=...`) — autorisé par utilisateur pour scripts
- Login admin : lyestriki@yahoo.fr

## Push manuel à faire pour la prochaine session
Working tree clean. Rien à pusher. Le commit `8fcabff` attend juste d'être déployé sur Coolify.
