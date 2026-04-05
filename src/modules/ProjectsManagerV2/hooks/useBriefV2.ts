import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabase'
import type { ProjectBrief } from '../../../types/project-v2'

interface UseBriefV2Return {
  brief: ProjectBrief | null
  loading: boolean
  saveBrief: (data: Partial<ProjectBrief>) => Promise<void>
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
      // Update
      const { data: updated, error } = await supabase
        .from('project_briefs_v2')
        .update(data)
        .eq('id', brief.id)
        .select()
        .single()
      if (!error && updated) setBrief(updated as ProjectBrief)
    } else {
      // Insert
      const { data: created, error } = await supabase
        .from('project_briefs_v2')
        .insert({ ...data, project_id: projectId })
        .select()
        .single()
      if (!error && created) setBrief(created as ProjectBrief)
    }
  }, [brief, projectId])

  return { brief, loading, saveBrief }
}
