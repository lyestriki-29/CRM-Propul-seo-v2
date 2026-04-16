import { useState, useCallback, useMemo, useEffect } from 'react'
import { MOCK_ERP_TASKS } from '../../mocks/mockERPTasks'
import type { CommTask, CommTaskStatus, CommTaskPriority } from '../../../../types/project-v2'

export type ERPTaskView = 'project' | 'month' | 'week'

export interface ERPTaskFiltersState {
  priorities: CommTaskPriority[]
  statuses: CommTaskStatus[]
  projectIds: string[]
}

export function useERPTasks(initialView: ERPTaskView = 'project') {
  const [tasks, setTasks] = useState<CommTask[]>(MOCK_ERP_TASKS)
  const [view, setView] = useState<ERPTaskView>(initialView)

  // Sync si le parent change la vue
  useEffect(() => { setView(initialView) }, [initialView])
  const [filters, setFilters] = useState<ERPTaskFiltersState>({
    priorities: ['faible', 'moyenne', 'haute', 'critique'],
    statuses: ['todo', 'in_progress', 'done'],
    projectIds: [],  // vide = tous les projets
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<CommTask | null>(null)
  const [defaultDate, setDefaultDate] = useState<string>('')

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (!filters.priorities.includes(t.priority)) return false
      if (!filters.statuses.includes(t.status)) return false
      if (filters.projectIds.length > 0 && !filters.projectIds.includes(t.project_id)) return false
      return true
    })
  }, [tasks, filters])

  const createTask = useCallback((data: Omit<CommTask, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString()
    const task: CommTask = { ...data, id: `et-${Date.now()}`, created_at: now, updated_at: now }
    setTasks(prev => [...prev, task])
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<CommTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch, updated_at: new Date().toISOString() } : t))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTask = useCallback((id: string, patch: { due_date?: string; due_hour?: number; project_id?: string; project_name?: string; project_color?: string }) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch, updated_at: new Date().toISOString() } : t))
  }, [])

  const openCreate = useCallback((date?: string) => {
    setEditingTask(null)
    setDefaultDate(date ?? '')
    setModalOpen(true)
  }, [])

  const openEdit = useCallback((task: CommTask) => {
    setEditingTask(task)
    setDefaultDate('')
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setEditingTask(null)
    setDefaultDate('')
  }, [])

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    view, setView,
    filters, setFilters,
    currentDate, setCurrentDate,
    modalOpen, editingTask, defaultDate,
    createTask, updateTask, deleteTask, moveTask,
    openCreate, openEdit, closeModal,
  }
}
