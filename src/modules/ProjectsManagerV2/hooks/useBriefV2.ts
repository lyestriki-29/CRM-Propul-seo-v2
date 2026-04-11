import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseAnon } from '@/lib/supabase'
import type { ProjectBrief } from '../../../types/project-v2'

// Fix 1: BriefFields exported at module scope
export type BriefFields = Pick<
  ProjectBrief,
  'objective' | 'target_audience' | 'pages' | 'techno' | 'design_references' | 'notes'
>

// Fix 5: enableBriefToken and disableBriefToken have no projectId parameter
interface UseBriefV2Return {
  brief: ProjectBrief | null
  loading: boolean
  projectName: string
  briefToken: string | null
  tokenEnabled: boolean
  saveBrief: (data: Partial<ProjectBrief>) => Promise<void>
  enableBriefToken: () => Promise<string | null>
  disableBriefToken: () => Promise<boolean>
}

export function useBriefV2(projectId: string): UseBriefV2Return {
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState('')
  const [briefToken, setBriefToken] = useState<string | null>(null)
  const [tokenEnabled, setTokenEnabled] = useState(false)

  useEffect(() => {
    // Fix 4: set loading false before returning on empty projectId
    if (!projectId) {
      setLoading(false)
      return
    }
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
    // Fetch token state from projects_v2
    supabase
      .from('projects_v2')
      .select('brief_token, brief_token_enabled, name')
      .eq('id', projectId)
      .single()
      .then(({ data }) => {
        if (data) {
          setBriefToken(data.brief_token ?? null)
          setTokenEnabled(data.brief_token_enabled ?? false)
          setProjectName(data.name ?? '')
        }
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
      if (error) throw new Error(error.message)
      if (updated) setBrief(updated as ProjectBrief)
    } else {
      const { data: created, error } = await supabase
        .from('project_briefs_v2')
        .insert({ ...data, project_id: projectId })
        .select()
        .single()
      if (error) throw new Error(error.message)
      if (created) setBrief(created as ProjectBrief)
    }
  }, [brief, projectId])

  // Fix 5: no projectId parameter — uses outer projectId from closure
  const enableBriefToken = useCallback(async (): Promise<string | null> => {
    const token = crypto.randomUUID()
    const { error } = await supabase
      .from('projects_v2')
      .update({ brief_token: token, brief_token_enabled: true })
      .eq('id', projectId)
    if (error) return null
    setBriefToken(token)
    setTokenEnabled(true)
    return token
  }, [projectId])

  // Fix 5: no projectId parameter — uses outer projectId from closure
  const disableBriefToken = useCallback(async (): Promise<boolean> => {
    const { error } = await supabase
      .from('projects_v2')
      .update({ brief_token: null, brief_token_enabled: false })
      .eq('id', projectId)
    if (error) return false
    setBriefToken(null)
    setTokenEnabled(false)
    return true
  }, [projectId])

  return { brief, loading, projectName, briefToken, tokenEnabled, saveBrief, enableBriefToken, disableBriefToken }
}

// Hook séparé pour l'accès public (page ClientBriefPage — sans auth)

// Fix 2: BriefFormData now includes projectId
interface BriefFormData {
  projectId: string
  projectName: string
  brief: ProjectBrief | null
}

export function useBriefByToken(token: string) {
  const [data, setData] = useState<BriefFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    // Fix 3: reset error/data at start of effect
    setError(null)
    setData(null)
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

        // Fix 2: cache project.id in data
        setData({ projectId: project.id, projectName: project.name, brief: brief as ProjectBrief | null })
        setLoading(false)
      })
  }, [token])

  // Fix 2: use data.projectId directly — no redundant re-fetch
  const submitBrief = useCallback(async (fields: BriefFields): Promise<boolean> => {
    if (!data) return false
    const payload = {
      ...fields,
      project_id: data.projectId,
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
  }, [data])

  return { data, loading, error, submitBrief }
}
