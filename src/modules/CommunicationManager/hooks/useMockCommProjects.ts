import { useState, useEffect, useCallback } from 'react'
import { v2 } from '../../../lib/supabase'
import { MOCK_COMM_PROJECTS } from '../mocks'
import type { ProjectV2, StatusComm } from '../../../types/project-v2'

type CommProject = ProjectV2 & { comm_status: StatusComm }

export function useMockCommProjects() {
  const [projects, setProjects] = useState<CommProject[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey(k => k + 1), [])

  useEffect(() => {
    setLoading(true)
    v2
      .from('projects')
      .select('*')
      .eq('is_archived', false)
      .in('category', ['communication', 'comm'])
      .order('last_activity_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProjects(data.map((p: ProjectV2) => ({
            ...p,
            comm_status: ((p as Record<string, unknown>).comm_status as StatusComm) || (p.status as StatusComm) || 'prospect',
          })))
        } else {
          setProjects(MOCK_COMM_PROJECTS)
        }
        setLoading(false)
      })
  }, [refreshKey])

  const updateStatus = useCallback(async (id: string, status: StatusComm) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, comm_status: status } : p))
    await v2.from('projects').update({ comm_status: status }).eq('id', id)
  }, [])

  const addProject = useCallback(async (data: Omit<CommProject, 'id' | 'created_at' | 'updated_at'>) => {
    const { comm_status, ...projectData } = data
    const payload = { ...projectData, comm_status: comm_status || 'prospect' }
    const { data: created, error } = await v2
      .from('projects')
      .insert(payload)
      .select()
      .single()
    if (!error && created) {
      const p = created as ProjectV2
      setProjects(prev => [...prev, {
        ...p,
        comm_status: ((p as Record<string, unknown>).comm_status as StatusComm) || 'prospect',
      }])
      return p.id
    }
    const id = `comm-${Date.now()}`
    const now = new Date().toISOString()
    setProjects(prev => [...prev, { ...data, id, created_at: now, updated_at: now }])
    return id
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    await v2.from('projects').delete().eq('id', id)
  }, [])

  return { projects, loading, updateStatus, addProject, deleteProject, refetch }
}
