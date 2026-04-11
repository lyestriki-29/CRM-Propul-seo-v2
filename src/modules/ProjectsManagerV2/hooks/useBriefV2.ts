import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '@/lib/supabase'
import type { ProjectBrief } from '../../../types/project-v2'

// Client anon — pour les accès publics (page brief client)
const supabaseAnon = createClient(
  isDemoMode ? 'https://demo.supabase.co' : import.meta.env.VITE_SUPABASE_URL,
  isDemoMode ? 'demo-key' : import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface UseBriefV2Return {
  brief: ProjectBrief | null
  loading: boolean
  saveBrief: (data: Partial<ProjectBrief>) => Promise<void>
  enableBriefToken: (projectId: string) => Promise<string | null>
  disableBriefToken: (projectId: string) => Promise<boolean>
}

export function useBriefV2(projectId: string): UseBriefV2Return {
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    supabase
      .from('project_briefs_v2')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setBrief(data as ProjectBrief | null)
        setLoading(false)
      })
  }, [projectId])

  const saveBrief = useCallback(async (data: Partial<ProjectBrief>) => {
    if (brief) {
      const { data: updated, error } = await supabase
        .from('project_briefs_v2')
        .update(data)
        .eq('id', brief.id)
        .select()
        .single()
      if (!error && updated) setBrief(updated as ProjectBrief)
    } else {
      const { data: created, error } = await supabase
        .from('project_briefs_v2')
        .insert({ ...data, project_id: projectId })
        .select()
        .single()
      if (!error && created) setBrief(created as ProjectBrief)
    }
  }, [brief, projectId])

  // Génère un brief_token et active le formulaire (utilisateur authentifié)
  const enableBriefToken = useCallback(async (projectId: string): Promise<string | null> => {
    const token = crypto.randomUUID()
    const { error } = await supabase
      .from('projects_v2')
      .update({ brief_token: token, brief_token_enabled: true })
      .eq('id', projectId)
    if (error) return null
    return token
  }, [])

  // Désactive le formulaire et efface le token (utilisateur authentifié)
  const disableBriefToken = useCallback(async (projectId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('projects_v2')
      .update({ brief_token: null, brief_token_enabled: false })
      .eq('id', projectId)
    return !error
  }, [])

  return { brief, loading, saveBrief, enableBriefToken, disableBriefToken }
}

// Hook séparé pour l'accès public (page ClientBriefPage — sans auth)
interface BriefFormData {
  projectName: string
  brief: ProjectBrief | null
}

export function useBriefByToken(token: string) {
  const [data, setData] = useState<BriefFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)

    supabaseAnon
      .from('projects_v2')
      .select('id, name')
      .eq('brief_token', token)
      .eq('brief_token_enabled', true)
      .single()
      .then(async ({ data: project, error: projectError }) => {
        if (projectError || !project) {
          setError('Lien invalide ou désactivé.')
          setLoading(false)
          return
        }

        const { data: brief } = await supabaseAnon
          .from('project_briefs_v2')
          .select('*')
          .eq('project_id', project.id)
          .maybeSingle()

        setData({ projectName: project.name, brief: brief as ProjectBrief | null })
        setLoading(false)
      })
  }, [token])

  // Soumet le brief (upsert anon) — status et submitted_at gérés en interne
  type BriefFields = Pick<ProjectBrief, 'objective' | 'target_audience' | 'pages' | 'techno' | 'design_references' | 'notes'>
  const submitBrief = useCallback(async (fields: BriefFields): Promise<boolean> => {
    if (!data) return false

    // Récupérer le project_id via le token
    const { data: project } = await supabaseAnon
      .from('projects_v2')
      .select('id')
      .eq('brief_token', token)
      .eq('brief_token_enabled', true)
      .single()

    if (!project) return false

    const payload = {
      ...fields,
      project_id: project.id,
      status: 'submitted' as const,
      submitted_at: new Date().toISOString(),
    }

    if (data.brief) {
      const { error } = await supabaseAnon
        .from('project_briefs_v2')
        .update(payload)
        .eq('id', data.brief.id)
      return !error
    } else {
      const { error } = await supabaseAnon
        .from('project_briefs_v2')
        .insert(payload)
      return !error
    }
  }, [data, token])

  return { data, loading, error, submitBrief }
}
