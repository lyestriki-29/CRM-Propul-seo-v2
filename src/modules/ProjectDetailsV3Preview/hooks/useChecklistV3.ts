// Copie isolée pour V3 — comportement identique à useMockChecklist (V2).
// Ne pas modifier le hook V2 ; toute évolution se fait ici.
import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { MOCK_SITEWEB_CHECKLISTS } from '@/modules/SiteWebManager/mocks/mockSiteWebChecklists'
import { MOCK_ERP_CHECKLISTS } from '@/modules/ERPManager/mocks/mockERPChecklists'
import type { ChecklistItemV2, ChecklistPhase, ChecklistStatus } from '@/types/project-v2'

const MOCK_REGISTRY: Record<string, ChecklistItemV2[]> = {
  ...MOCK_SITEWEB_CHECKLISTS,
  ...MOCK_ERP_CHECKLISTS,
}

function isMockProject(projectId: string) {
  return projectId.startsWith('sw-') || projectId.startsWith('erp-') || projectId.startsWith('comm-')
}

interface UseReturn {
  items: ChecklistItemV2[]
  loading: boolean
  progress: number
  progressByPhase: Record<ChecklistPhase, { total: number; done: number; percent: number }>
  addItem: (item: Omit<ChecklistItemV2, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  addItems: (items: Omit<ChecklistItemV2, 'id' | 'created_at' | 'updated_at'>[]) => Promise<void>
  updateItem: (id: string, updates: Partial<ChecklistItemV2>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  setItemStatus: (id: string, status: ChecklistStatus) => Promise<void>
}

const PHASES: ChecklistPhase[] = ['onboarding', 'conception', 'developpement', 'recette', 'post_livraison', 'general']

export function useChecklistV3(projectId: string): UseReturn {
  const [items, setItems] = useState<ChecklistItemV2[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    if (isMockProject(projectId)) {
      setItems(MOCK_REGISTRY[projectId] ?? [])
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('checklist_items_v2')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as ChecklistItemV2[])
        setLoading(false)
      })
  }, [projectId])

  const progress = useMemo(() => {
    const rootItems = items.filter((i) => !i.parent_task_id)
    if (rootItems.length === 0) return 0
    return Math.round((rootItems.filter((i) => i.status === 'done').length / rootItems.length) * 100)
  }, [items])

  const progressByPhase = useMemo(() => {
    const result = {} as Record<ChecklistPhase, { total: number; done: number; percent: number }>
    for (const phase of PHASES) {
      const phaseItems = items.filter((i) => i.phase === phase && !i.parent_task_id)
      const done = phaseItems.filter((i) => i.status === 'done').length
      result[phase] = {
        total: phaseItems.length,
        done,
        percent: phaseItems.length > 0 ? Math.round((done / phaseItems.length) * 100) : 0,
      }
    }
    return result
  }, [items])

  // Le type ChecklistItemV2 utilise `position` mais la table BDD `public.checklist_items_v2`
  // utilise `sort_order`. On normalise au point d'insertion BDD pour éviter le silent fail.
  const toDbRow = (data: Omit<ChecklistItemV2, 'id' | 'created_at' | 'updated_at'>) => {
    const { position, ...rest } = data as Record<string, unknown>
    return {
      ...rest,
      project_id: projectId,
      sort_order: position ?? (rest as Record<string, unknown>).sort_order ?? 0,
    }
  }

  const addItem = useCallback(
    async (data: Omit<ChecklistItemV2, 'id' | 'created_at' | 'updated_at'>) => {
      if (isMockProject(projectId)) {
        const newItem: ChecklistItemV2 = {
          ...data,
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setItems((prev) => [...prev, newItem])
        return
      }
      const { data: created, error } = await supabase
        .from('checklist_items_v2')
        .insert(toDbRow(data))
        .select()
        .single()
      if (error) {
        console.error('[useChecklistV3] addItem failed', { data, error })
        throw new Error(`Impossible d'ajouter la tâche : ${error.message}`)
      }
      if (created) setItems((prev) => [...prev, created as ChecklistItemV2])
    },
    [projectId],
  )

  const addItems = useCallback(
    async (dataList: Omit<ChecklistItemV2, 'id' | 'created_at' | 'updated_at'>[]) => {
      if (isMockProject(projectId)) {
        const now = new Date().toISOString()
        const newItems = dataList.map((data) => ({
          ...data,
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          created_at: now,
          updated_at: now,
        }))
        setItems((prev) => [...prev, ...newItems])
        return
      }
      const rows = dataList.map(toDbRow)
      const { data: created, error } = await supabase.from('checklist_items_v2').insert(rows).select()
      if (error) {
        console.error('[useChecklistV3] addItems failed', { count: dataList.length, error })
        throw new Error(`Impossible d'ajouter les tâches : ${error.message}`)
      }
      if (created) setItems((prev) => [...prev, ...(created as ChecklistItemV2[])])
    },
    [projectId],
  )

  const updateItem = useCallback(
    async (id: string, updates: Partial<ChecklistItemV2>) => {
      if (isMockProject(projectId)) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i)),
        )
        return
      }
      const { position, ...restUpdates } = updates as Record<string, unknown>
      const dbUpdates =
        position !== undefined ? { ...restUpdates, sort_order: position } : restUpdates
      const { data, error } = await supabase
        .from('checklist_items_v2')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()
      if (error) {
        console.error('[useChecklistV3] updateItem failed', { id, updates, error })
        throw new Error(`Impossible de modifier la tâche : ${error.message}`)
      }
      if (data) setItems((prev) => prev.map((i) => (i.id === id ? (data as ChecklistItemV2) : i)))
    },
    [projectId],
  )

  const deleteItem = useCallback(
    async (id: string) => {
      if (isMockProject(projectId)) {
        setItems((prev) => prev.filter((i) => i.id !== id && i.parent_task_id !== id))
        return
      }
      // Optimiste : on capture le snapshot juste avant la mutation pour éviter
      // les races sur double-clic (lire prev dans le setter, pas dans la closure).
      let snapshot: ChecklistItemV2[] = []
      setItems((prev) => {
        snapshot = prev
        return prev.filter((i) => i.id !== id && i.parent_task_id !== id)
      })
      const { error } = await supabase.from('checklist_items_v2').delete().eq('id', id)
      if (error) {
        console.error('[useChecklistV3] deleteItem failed', { id, error })
        setItems(snapshot)
        throw new Error(`Impossible de supprimer la tâche : ${error.message}`)
      }
    },
    [projectId],
  )

  const setItemStatus = useCallback(
    async (id: string, status: ChecklistStatus) => {
      if (isMockProject(projectId)) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status, updated_at: new Date().toISOString() } : i)),
        )
        return
      }
      // Optimiste : on capture l'item au moment du setter (pas via closure)
      // pour éviter qu'un rollback efface une mutation concurrente.
      let previous: ChecklistItemV2 | null = null
      setItems((prev) => {
        const found = prev.find((i) => i.id === id)
        if (!found) return prev
        previous = found
        return prev.map((i) => (i.id === id ? { ...i, status, updated_at: new Date().toISOString() } : i))
      })
      if (!previous) return
      const { data, error } = await supabase
        .from('checklist_items_v2')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      if (error) {
        console.error('[useChecklistV3] setItemStatus failed', { id, status, error })
        const rollback = previous
        setItems((prev) => prev.map((i) => (i.id === id ? rollback : i)))
        throw new Error(`Impossible de changer le statut : ${error.message}`)
      }
      if (data) setItems((prev) => prev.map((i) => (i.id === id ? (data as ChecklistItemV2) : i)))
    },
    [projectId],
  )

  return { items, loading, progress, progressByPhase, addItem, addItems, updateItem, deleteItem, setItemStatus }
}
