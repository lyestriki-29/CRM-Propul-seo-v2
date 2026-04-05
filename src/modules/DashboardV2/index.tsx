// src/modules/DashboardV2/index.tsx
import { useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Zap } from 'lucide-react'
import { BentoGrid } from './components/BentoGrid'
import { KpiStatsWidget } from './components/right/KpiStatsWidget'
import { UpcomingMeetingsWidget } from './components/right/UpcomingMeetingsWidget'
import { QuickTasksWidget } from './components/right/QuickTasksWidget'
import { AiSummariesWidget } from './components/left/AiSummariesWidget'
import { PriorityActionsWidget } from './components/left/PriorityActionsWidget'
import { RevenueChartWidget } from './components/left/RevenueChartWidget'
import { useDashboardData } from './hooks/useDashboardData'
import { useDashboardRealtime } from './hooks/useDashboardRealtime'

export function DashboardV2() {
  const data = useDashboardData()

  // useDashboardRealtime déclenche un refresh quand une table change.
  // Les hooks Supabase existants (useProjectsV2, useSupabaseTasks, etc.)
  // se rechargent automatiquement via leur propre cycle de vie.
  // onRefresh est un no-op intentionnel ici.
  const onRefresh = useCallback(() => {}, [])

  const { isConnected, lastUpdatedAt } = useDashboardRealtime(onRefresh)

  const leftColumn = (
    <>
      <PriorityActionsWidget
        items={data.priorityActions}
        loading={data.loading}
        onNavigateToProject={data.handleNavigateToProject}
        onNavigateToLead={data.handleNavigateToLead}
      />
      <AiSummariesWidget
        projects={data.aiProjects}
        loading={data.loading}
        onNavigateToProject={data.handleNavigateToProject}
      />
      <RevenueChartWidget
        data={data.revenueChartData}
        loading={data.loading}
      />
    </>
  )

  const rightColumn = (
    <>
      <KpiStatsWidget kpis={data.kpis} loading={data.loading} />
      <UpcomingMeetingsWidget onNavigateToProject={data.handleNavigateToProject} />
      <QuickTasksWidget tasks={data.todayTasksList} loading={data.loading} />
    </>
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 h-full overflow-auto">
      {/* Bandeau realtime déconnecté — visible seulement si on était connecté puis déconnecté */}
      {!isConnected && lastUpdatedAt && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-2 border border-border/50 rounded-xl px-3 py-2">
          <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            Données en temps réel indisponibles — dernière mise à jour{' '}
            {formatDistanceToNow(lastUpdatedAt, { locale: fr, addSuffix: true })}
          </span>
        </div>
      )}

      <BentoGrid left={leftColumn} right={rightColumn} />
    </div>
  )
}
