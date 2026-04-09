import { useState, useCallback } from 'react'
import { MOCK_COMM_CYCLES, MOCK_COMM_CYCLE_TASKS, COMM_CHECKLIST_INSTAGRAM } from '../mocks'
import type { CommMonthlyCycle, CommCycleTask } from '../../../types/project-v2'

export function useMockCommCycles(projectId: string) {
  const [cycles, setCycles] = useState<CommMonthlyCycle[]>(MOCK_COMM_CYCLES[projectId] ?? [])
  const [tasks, setTasks] = useState<Record<string, CommCycleTask[]>>(MOCK_COMM_CYCLE_TASKS)

  const addCycle = useCallback(() => {
    const now = new Date()
    const lastCycle = cycles[cycles.length - 1]
    const nextDate = lastCycle
      ? new Date(new Date(lastCycle.mois).setMonth(new Date(lastCycle.mois).getMonth() + 1))
      : now
    nextDate.setDate(1)
    const mois = nextDate.toISOString().split('T')[0]
    const label = nextDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, c => c.toUpperCase())
    const cycleId = `cyc-${projectId}-${Date.now()}`

    const newCycle: CommMonthlyCycle = {
      id: cycleId,
      project_id: projectId,
      mois,
      label,
      status: 'en_cours',
      created_at: now.toISOString(),
    }

    const newTasks: CommCycleTask[] = COMM_CHECKLIST_INSTAGRAM.map((t, i) => ({
      id: `ct-${cycleId}-${i}`,
      cycle_id: cycleId,
      project_id: projectId,
      title: t.title,
      done: false,
      sort_order: t.sort_order ?? i + 1,
    }))

    setCycles(prev => [...prev, newCycle])
    setTasks(prev => ({ ...prev, [cycleId]: newTasks }))
  }, [cycles, projectId])

  const toggleTask = useCallback((cycleId: string, taskId: string) => {
    setTasks(prev => {
      const updated = (prev[cycleId] ?? []).map(t =>
        t.id === taskId ? { ...t, done: !t.done } : t
      )
      const allDone = updated.every(t => t.done)
      if (allDone) {
        setCycles(c => c.map(cycle =>
          cycle.id === cycleId ? { ...cycle, status: 'termine' } : cycle
        ))
      }
      return { ...prev, [cycleId]: updated }
    })
  }, [])

  const addTask = useCallback((cycleId: string, title: string) => {
    setTasks(prev => {
      const cycleTasks = prev[cycleId] ?? []
      const newTask: CommCycleTask = {
        id: `ct-custom-${Date.now()}`,
        cycle_id: cycleId,
        project_id: projectId,
        title,
        done: false,
        sort_order: cycleTasks.length + 1,
      }
      return { ...prev, [cycleId]: [...cycleTasks, newTask] }
    })
  }, [projectId])

  return { cycles, tasks, addCycle, toggleTask, addTask }
}
