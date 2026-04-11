-- supabase/migrations/20260411_brief_token.sql
--
-- IMPORTANT: This migration must be manually executed in the Supabase Dashboard SQL Editor.
-- It cannot be auto-applied via CLI migrations.
--
-- This migration adds brief_token support for public brief submission links:
-- - Adds brief_token and brief_token_enabled columns to projects_v2
-- - Adds submitted_at column to project_briefs_v2
-- - Creates RLS policies for anonymous users to read/write briefs via token
--

-- 1. Colonnes brief_token sur projects_v2
ALTER TABLE public.projects_v2
  ADD COLUMN IF NOT EXISTS brief_token         UUID    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS brief_token_enabled BOOLEAN DEFAULT FALSE;

-- 2. Index unique (lookup rapide + contrainte d'unicité)
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_v2_brief_token
  ON public.projects_v2 (brief_token)
  WHERE brief_token IS NOT NULL;

-- 3. Colonne submitted_at sur project_briefs_v2
ALTER TABLE public.project_briefs_v2
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NULL;

-- 4. Politique RLS — lecture publique (anon) du projet via brief_token (nom du projet uniquement)
CREATE POLICY "brief_read_project_name"
  ON public.projects_v2
  FOR SELECT
  TO anon
  USING (brief_token IS NOT NULL AND brief_token_enabled = TRUE);

-- 5. Politique RLS — lecture publique du brief via brief_token
CREATE POLICY "brief_read_project_briefs_v2"
  ON public.project_briefs_v2
  FOR SELECT
  TO anon
  USING (
    project_id IN (
      SELECT id FROM public.projects_v2
      WHERE brief_token IS NOT NULL AND brief_token_enabled = TRUE
    )
  );

-- 6. Politique RLS — écriture publique (anon) dans project_briefs_v2 via brief_token (INSERT)
CREATE POLICY "brief_insert_project_briefs_v2"
  ON public.project_briefs_v2
  FOR INSERT
  TO anon
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects_v2
      WHERE brief_token IS NOT NULL AND brief_token_enabled = TRUE
    )
  );

-- 7. Politique RLS — écriture publique (anon) dans project_briefs_v2 via brief_token (UPDATE)
CREATE POLICY "brief_update_project_briefs_v2"
  ON public.project_briefs_v2
  FOR UPDATE
  TO anon
  USING (
    project_id IN (
      SELECT id FROM public.projects_v2
      WHERE brief_token IS NOT NULL AND brief_token_enabled = TRUE
    )
  );
