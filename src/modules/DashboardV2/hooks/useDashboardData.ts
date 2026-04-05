// src/modules/DashboardV2/hooks/useDashboardData.ts
import { useMemo } from 'react'
import { useProjectsV2 } from '../../ProjectsManagerV2/hooks/useProjectsV2'
import { useSupabaseTasks, useSupabaseLeads, useSupabaseAccountingEntries } from '../../../hooks/useSupabaseData'
import { useStore } from '../../../store/useStore'
import type { ProjectV2 } from '../../../types/project-v2'

export interface PriorityActionItem {
  id: string
  type: 'projet' | 'tache' | 'devis'
  label: string
  subLabel?: string
  severity: 'red' | 'orange' | 'yellow'
  projectId?: string
  leadId?: string
}

export interface DashboardKpis {
  activeProjects: number
  activeLeads: number
  todayTasks: number
  monthRevenue: number
}

export function useDashboardData() {
  const { navigateWithContext, currentUser } = useStore()
  const { projects, loading: projectsLoading } = useProjectsV2()
  const { data: tasks, loading: tasksLoading } = useSupabaseTasks()
  const { count: leadsCount, loading: leadsLoading } = useSupabaseLeads()
  const { data: accountingEntries, loading: accountingLoading } = useSupabaseAccountingEntries()

  const loading = projectsLoading || tasksLoading || leadsLoading || accountingLoading

  const kpis: DashboardKpis = useMemo(() => {
    const currentMonthKey = new Date().toISOString().slice(0, 7)
    const today = new Date().toISOString().slice(0, 10)

    const activeProjects = projects.filter(
      p => p.status !== 'closed' && !p.is_archived
    ).length

    const todayTasks = (tasks ?? []).filter(
      t => t.deadline === today && (t.status as string) !== 'done'
    ).length

    const monthRevenue = (accountingEntries ?? [])
      .filter(e => (e as any).month_key === currentMonthKey && e.type === 'revenue')
      .reduce((sum, e) => sum + Number((e as any).amount ?? 0), 0)

    return {
      activeProjects,
      activeLeads: leadsCount ?? 0,
      todayTasks,
      monthRevenue,
    }
  }, [projects, tasks, leadsCount, accountingEntries])

  const aiProjects = useMemo(() =>
    projects
      .filter(p => p.ai_summary !== null && !p.is_archived)
      .slice(0, 6),
    [projects]
  )

  const todayTasksList = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return (tasks ?? [])
      .filter(t =>
        t.deadline === today &&
        (t.status as string) !== 'done' &&
        (t.assigned_to === currentUser?.id || !t.assigned_to)
      )
      .slice(0, 8)
  }, [tasks, currentUser])

  const priorityActions = useMemo((): PriorityActionItem[] => {
    const items: PriorityActionItem[] = []
    const today = new Date().toISOString().slice(0, 10)

    projects
      .filter(p => p.completion_score < 50 && p.status !== 'closed' && !p.is_archived)
      .slice(0, 3)
      .forEach(p => {
        items.push({
          id: `proj-${p.id}`,
          type: 'projet',
          label: p.name,
          subLabel: `Score : ${p.completion_score}%`,
          severity: p.completion_score < 25 ? 'red' : 'orange',
          projectId: p.id,
        })
      })

    ;(tasks ?? [])
      .filter(t => t.deadline && t.deadline < today && (t.status as string) !== 'done')
      .slice(0, 3)
      .forEach(t => {
        items.push({
          id: `task-${t.id}`,
          type: 'tache',
          label: t.title,
          subLabel: `Deadline : ${t.deadline}`,
          severity: 'red',
        })
      })

    return items
      .sort((a, b) => {
        const order = { red: 0, orange: 1, yellow: 2 }
        return order[a.severity] - order[b.severity]
      })
      .slice(0, 5)
  }, [projects, tasks])

  const revenueChartData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 12 }, (_, i) => {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`
      const revenue = (accountingEntries ?? [])
        .filter(e => (e as any).month_key === monthKey && e.type === 'revenue')
        .reduce((sum, e) => sum + Number((e as any).amount ?? 0), 0)
      return { monthKey, revenue }
    })
  }, [accountingEntries])

  const handleNavigateToProject = (id: string) =>
    navigateWithContext('projects-v2', { projectId: id })

  const handleNavigateToLead = (id: string) =>
    navigateWithContext('crm-erp-lead-details', { leadId: id })

  return {
    loading,
    kpis,
    aiProjects,
    todayTasksList,
    priorityActions,
    revenueChartData,
    handleNavigateToProject,
    handleNavigateToLead,
    rawTasks: tasks ?? [],
  }
}
