// src/modules/DashboardV2/index.tsx
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Zap, Settings } from 'lucide-react'
import { BriefNotificationsModal } from './components/BriefNotificationsModal'
import { routes } from '../../lib/routes'
import { BentoGrid } from './components/BentoGrid'
import { KpiStatsWidget } from './components/right/KpiStatsWidget'
import { UpcomingMeetingsWidget } from './components/right/UpcomingMeetingsWidget'
import { QuickTasksWidget } from './components/right/QuickTasksWidget'
import { AiSummariesWidget } from './components/left/AiSummariesWidget'
import { PriorityActionsWidget } from './components/left/PriorityActionsWidget'
import { RevenueChartWidget } from './components/left/RevenueChartWidget'
import { ActiveProjectsWidget } from './components/left/ActiveProjectsWidget'
import { useDashboardData } from './hooks/useDashboardData'
import { useDashboardKpisV2 } from './hooks/useDashboardKpisV2'
import { useDashboardRealtime } from './hooks/useDashboardRealtime'
import { useUnreadEmails } from './hooks/useUnreadEmails'

export function DashboardV2() {
  const navigate = useNavigate()
  const data = useDashboardData()
  const { emails, markAsReplied } = useUnreadEmails()

  // useDashboardRealtime déclenche un refresh quand une table change.
  // Les hooks Supabase existants (useProjectsV2, useSupabaseTasks, etc.)
  // se rechargent automatiquement via leur propre cycle de vie.
  // onRefresh est un no-op intentionnel ici.
  const onRefresh = useCallback(() => {}, [])

  const { isConnected, lastUpdatedAt } = useDashboardRealtime(onRefresh)

  const [showNotifModal, setShowNotifModal] = useState(false)

  const handleNavigateToAllProjects = useCallback(
    () => navigate(routes.projects),
    [navigate]
  )

  // KPIs V2 globaux — branchés sur la comptabilité réelle
  const v2Kpis = useDashboardKpisV2()

  // Fusionner emails non répondus dans les actions prioritaires
  const allPriorityItems = useMemo(() => {
    const emailItems = emails.map(e => ({
      id: `email-${e.id}`,
      type: 'email' as const,
      label: e.metadata?.subject ?? e.content,
      subLabel: e.metadata?.from ?? undefined,
      severity: 'orange' as const,
      projectId: e.project_id ?? undefined,
      activityId: e.id,
    }))
    return [...emailItems, ...data.priorityActions].slice(0, 8)
  }, [emails, data.priorityActions])

  const leftColumn = (
    <>
      <PriorityActionsWidget
        items={allPriorityItems}
        loading={data.loading}
        onNavigateToProject={data.handleNavigateToProject}
        onNavigateToLead={data.handleNavigateToLead}
        onMarkEmailReplied={markAsReplied}
      />
      <ActiveProjectsWidget
        projects={data.activeProjectsList}
        loading={data.loading}
        onNavigateToProject={data.handleNavigateToProject}
        onNavigateToAllProjects={handleNavigateToAllProjects}
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
      {/* Bouton paramètres notifications brief */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowNotifModal(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-2"
          title="Paramètres notifications brief"
        >
          <Settings className="w-3.5 h-3.5" />
          Notifications brief
        </button>
      </div>
      <BriefNotificationsModal
        open={showNotifModal}
        onClose={() => setShowNotifModal(false)}
      />
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

      {/* KPIs globaux V2 — source : accounting_entries (année en cours) + projects_v2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">CA Total {new Date().getFullYear()}</p>
          <p className="text-xl font-bold text-foreground">{v2Kpis.totalCa.toLocaleString('fr-FR')}€</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">MRR Communication</p>
          <p className="text-xl font-bold text-emerald-400">{v2Kpis.mrrComm.toLocaleString('fr-FR')}€/mois</p>
          <p className="text-xs text-muted-foreground mt-1">{v2Kpis.commActive} projet{v2Kpis.commActive !== 1 ? 's' : ''} actif{v2Kpis.commActive !== 1 ? 's' : ''}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Site Web & SEO</p>
          <p className="text-xl font-bold text-blue-400">{v2Kpis.caSiteWeb.toLocaleString('fr-FR')}€</p>
          <p className="text-xs text-muted-foreground mt-1">{v2Kpis.swActive} projet{v2Kpis.swActive !== 1 ? 's' : ''} actif{v2Kpis.swActive !== 1 ? 's' : ''}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">ERP Sur Mesure</p>
          <p className="text-xl font-bold text-violet-400">{v2Kpis.caErp.toLocaleString('fr-FR')}€</p>
          <p className="text-xs text-muted-foreground mt-1">{v2Kpis.erpActive} projet{v2Kpis.erpActive !== 1 ? 's' : ''} actif{v2Kpis.erpActive !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <BentoGrid left={leftColumn} right={rightColumn} />
    </div>
  )
}
