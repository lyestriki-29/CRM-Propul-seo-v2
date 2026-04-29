// src/modules/DashboardV2/hooks/useDashboardData.ts
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectsV2 } from '../../ProjectsManagerV2/hooks/useProjectsV2'
import { useSupabaseTasks, useSupabaseLeads, useSupabaseAccountingEntries } from '../../../hooks/useSupabaseData'
import { useStore } from '../../../store/useStore'
import { routes } from '../../../lib/routes'

export interface PriorityActionItem {
  id: string
  type: 'projet' | 'tache' | 'devis' | 'email'
  label: string
  subLabel?: string
  severity: 'red' | 'orange' | 'yellow'
  projectId?: string
  leadId?: string
  activityId?: string   // pour les emails — permet le markAsReplied
}

export interface DashboardKpis {
  activeProjects: number
  activeLeads: number
  todayTasks: number
  monthRevenue: number
}

export function useDashboardData() {
  const navigate = useNavigate()
  const { currentUser } = useStore()
  const { projects, loading: projectsLoading } = useProjectsV2()
  const { data: tasks, loading: tasksLoading } = useSupabaseTasks()
  const { data: leadsData, loading: leadsLoading } = useSupabaseLeads()
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

    // month_key n'existe pas dans le type AccountingEntryRow — on le dérive de entry_date
    const monthRevenue = (accountingEntries ?? [])
      .filter(e => e.entry_date?.slice(0, 7) === currentMonthKey && e.type === 'revenue')
      .reduce((sum, e) => sum + Number(e.amount ?? 0), 0)

    // Filtrer sur les statuts actifs (prospect + devis) — pas les leads fermés/perdus
    const activeLeads = (leadsData ?? []).filter(
      l => !['closed', 'signe', 'livre', 'perdu'].includes((l as any).status ?? '')
    ).length

    return {
      activeProjects,
      activeLeads,
      todayTasks,
      monthRevenue,
    }
  }, [projects, tasks, leadsData, accountingEntries])

  const aiProjects = useMemo(() =>
    projects
      .filter(p => p.ai_summary !== null && !p.is_archived)
      .slice(0, 6),
    [projects]
  )

  const activeProjectsList = useMemo(() =>
    projects
      .filter(p => p.status !== 'closed' && !p.is_archived)
      .sort((a, b) => {
        const aDate = a.last_activity_at ?? a.updated_at
        const bDate = b.last_activity_at ?? b.updated_at
        return bDate.localeCompare(aDate)
      })
      .slice(0, 8),
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
      // month_key n'existe pas dans le type AccountingEntryRow — on le dérive de entry_date
      const revenue = (accountingEntries ?? [])
        .filter(e => e.entry_date?.slice(0, 7) === monthKey && e.type === 'revenue')
        .reduce((sum, e) => sum + Number(e.amount ?? 0), 0)
      return { monthKey, revenue }
    })
  }, [accountingEntries])

  const handleNavigateToProject = (id: string) =>
    navigate(`${routes.projects}?p=${id}`)

  const handleNavigateToLead = (id: string) =>
    navigate(routes.crmErpLead(id))

  return {
    loading,
    kpis,
    aiProjects,
    activeProjectsList,
    todayTasksList,
    priorityActions,
    revenueChartData,
    handleNavigateToProject,
    handleNavigateToLead,
    rawTasks: tasks ?? [],
  }
}
