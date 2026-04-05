-- Migration Sprint 2 : Enrichissement SIRET Pappers
ALTER TABLE projects_v2
  ADD COLUMN IF NOT EXISTS siret VARCHAR(14),
  ADD COLUMN IF NOT EXISTS company_data JSONB,
  ADD COLUMN IF NOT EXISTS company_enriched_at TIMESTAMPTZ;

-- Index pour recherche par SIRET
CREATE INDEX IF NOT EXISTS projects_v2_siret_idx ON projects_v2(siret) WHERE siret IS NOT NULL;
