// src/modules/DashboardV2/index.tsx
import { useCallback, useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Zap } from 'lucide-react'
import { MOCK_SITEWEB_PROJECTS } from '../SiteWebManager/mocks'
import { MOCK_ERP_PROJECTS } from '../ERPManager/mocks'
import { MOCK_COMM_PROJECTS, MOCK_COMM_BRIEFS } from '../CommunicationManager/mocks'
import { useStore } from '../../store/useStore'
import { BentoGrid } from './components/BentoGrid'
import { KpiStatsWidget } from './components/right/KpiStatsWidget'
import { UpcomingMeetingsWidget } from './components/right/UpcomingMeetingsWidget'
import { QuickTasksWidget } from './components/right/QuickTasksWidget'
import { AiSummariesWidget } from './components/left/AiSummariesWidget'
import { PriorityActionsWidget } from './components/left/PriorityActionsWidget'
import { RevenueChartWidget } from './components/left/RevenueChartWidget'
import { ActiveProjectsWidget } from './components/left/ActiveProjectsWidget'
import { useDashboardData } from './hooks/useDashboardData'
import { useDashboardRealtime } from './hooks/useDashboardRealtime'
import { useUnreadEmails } from './hooks/useUnreadEmails'

export function DashboardV2() {
  const { navigateWithContext } = useStore()
  const data = useDashboardData()
  const { emails, markAsReplied } = useUnreadEmails()

  // useDashboardRealtime déclenche un refresh quand une table change.
  // Les hooks Supabase existants (useProjectsV2, useSupabaseTasks, etc.)
  // se rechargent automatiquement via leur propre cycle de vie.
  // onRefresh est un no-op intentionnel ici.
  const onRefresh = useCallback(() => {}, [])

  const { isConnected, lastUpdatedAt } = useDashboardRealtime(onRefresh)

  const handleNavigateToAllProjects = useCallback(
    () => navigateWithContext('projects-v2', {}),
    [navigateWithContext]
  )

  // KPIs V2 globaux (données mock)
  const v2Kpis = useMemo(() => {
    const swCA = MOCK_SITEWEB_PROJECTS
      .filter(p => ['signe', 'en_production', 'livre'].includes(p.sw_status))
      .reduce((sum, p) => sum + (p.budget ?? 0), 0)
    const swActive = MOCK_SITEWEB_PROJECTS
      .filter(p => !['livre', 'perdu'].includes(p.sw_status)).length

    const erpCA = MOCK_ERP_PROJECTS
      .filter(p => ['signe', 'en_developpement', 'recette', 'livre'].includes(p.erp_status))
      .reduce((sum, p) => sum + (p.budget ?? 0), 0)
    const erpActive = MOCK_ERP_PROJECTS
      .filter(p => !['livre', 'perdu'].includes(p.erp_status)).length

    const mrr = MOCK_COMM_BRIEFS
      .filter(b => b.type_contrat === 'abonnement' && b.mrr != null)
      .reduce((sum, b) => sum + (b.mrr ?? 0), 0)
    const commActive = MOCK_COMM_PROJECTS
      .filter(p => p.comm_status === 'actif').length

    const totalCA = swCA + erpCA + mrr

    return { swCA, swActive, erpCA, erpActive, mrr, commActive, totalCA }
  }, [])

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

      {/* KPIs globaux V2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">CA Total V2</p>
          <p className="text-xl font-bold text-foreground">{v2Kpis.totalCA.toLocaleString('fr-FR')}€</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">MRR Communication</p>
          <p className="text-xl font-bold text-emerald-400">{v2Kpis.mrr.toLocaleString('fr-FR')}€/mois</p>
          <p className="text-xs text-muted-foreground mt-1">{v2Kpis.commActive} abonnement{v2Kpis.commActive !== 1 ? 's' : ''} actif{v2Kpis.commActive !== 1 ? 's' : ''}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Site Web & SEO</p>
          <p className="text-xl font-bold text-blue-400">{v2Kpis.swCA.toLocaleString('fr-FR')}€</p>
          <p className="text-xs text-muted-foreground mt-1">{v2Kpis.swActive} projet{v2Kpis.swActive !== 1 ? 's' : ''} actif{v2Kpis.swActive !== 1 ? 's' : ''}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">ERP Sur Mesure</p>
          <p className="text-xl font-bold text-violet-400">{v2Kpis.erpCA.toLocaleString('fr-FR')}€</p>
          <p className="text-xs text-muted-foreground mt-1">{v2Kpis.erpActive} projet{v2Kpis.erpActive !== 1 ? 's' : ''} actif{v2Kpis.erpActive !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <BentoGrid left={leftColumn} right={rightColumn} />
    </div>
  )
}
