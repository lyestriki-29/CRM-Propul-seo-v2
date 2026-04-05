import { useState, useCallback, useMemo } from 'react'
import type { ChecklistItemV2, ChecklistPhase, ChecklistStatus } from '../../../types/project-v2'
import { MOCK_CHECKLISTS } from '../mocks'

interface UseMockChecklistReturn {
  items: ChecklistItemV2[]
  loading: boolean
  progress: number
  progressByPhase: Record<ChecklistPhase, { total: number; done: number; percent: number }>
  addItem: (item: Omit<ChecklistItemV2, 'id' | 'created_at' | 'updated_at'>) => void
  updateItem: (id: string, updates: Partial<ChecklistItemV2>) => void
  deleteItem: (id: string) => void
  setItemStatus: (id: string, status: ChecklistStatus) => void
}

export function useMockChecklist(projectId: string): UseMockChecklistReturn {
  const initial = MOCK_CHECKLISTS[projectId] ?? []
  const [items, setItems] = useState<ChecklistItemV2[]>(initial)

  const progress = useMemo(() => {
    if (items.length === 0) return 0
    const done = items.filter(i => i.status === 'done').length
    return Math.round((done / items.length) * 100)
  }, [items])

  const progressByPhase = useMemo(() => {
    const phases: ChecklistPhase[] = ['onboarding', 'conception', 'developpement', 'recette', 'post_livraison', 'general']
    const result = {} as Record<ChecklistPhase, { total: number; done: number; percent: number }>
    for (const phase of phases) {
      const phaseItems = items.filter(i => i.phase === phase)
      const done = phaseItems.filter(i => i.status === 'done').length
      result[phase] = {
        total: phaseItems.length,
        done,
        percent: phaseItems.length > 0 ? Math.round((done / phaseItems.length) * 100) : 0,
      }
    }
    return result
  }, [items])

  const addItem = useCallback((data: Omit<ChecklistItemV2, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ChecklistItemV2 = {
      ...data,
      id: `ck-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setItems(prev => [...prev, newItem])
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<ChecklistItemV2>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      )
    )
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const setItemStatus = useCallback((id: string, status: ChecklistStatus) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status, updated_at: new Date().toISOString() }
          : item
      )
    )
  }, [])

  return {
    items,
    loading: false,
    progress,
    progressByPhase,
    addItem,
    updateItem,
    deleteItem,
    setItemStatus,
  }
}
