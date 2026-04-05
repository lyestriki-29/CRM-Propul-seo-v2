import { Euro, User, Calendar, TrendingUp, CheckSquare } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { ProjectStatusBadge } from '../../ProjectsManagerV2/components/ProjectStatusBadge'
import { PrestaList } from '../../ProjectsManagerV2/components/PrestaBadge'
import { CompletionScore } from '../../ProjectsManagerV2/components/CompletionScore'
import { DeadlineBadge } from '../../ProjectsManagerV2/components/DeadlineBadge'
import { NextActionCard } from './NextActionCard'
import { AiSummaryCard } from './AiSummaryCard'
import { SharePortalButton } from './SharePortalButton'
import { useProjectsV2Context } from '../../ProjectsManagerV2/context/ProjectsV2Context'
import type { ProjectV2 } from '../../../types/project-v2'

interface ProjectOverviewProps {
  project: ProjectV2
  onRefresh: () => void
}

function MetricCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  sub?: React.ReactNode
}) {
  return (
    <div className="bg-surface-2 rounded-lg p-3 border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

export function ProjectOverview({ project, onRefresh }: ProjectOverviewProps) {
  const { updateProject } = useProjectsV2Context()

  const formatDate = (d: string | null) =>
    d ? format(parseISO(d), 'd MMM yyyy', { locale: fr }) : '—'

  const handleNextActionUpdate = async (updates: {
    next_action_label: string | null
    next_action_due: string | null
  }) => {
    await updateProject(project.id, updates)
  }

  return (
    <div className="space-y-4">
      {/* En-tête projet */}
      <Card className="bg-surface-2 border-border">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground mb-1">{project.name}</h2>
              {project.client_name && (
                <p className="text-sm text-muted-foreground mb-2">{project.client_name}</p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <ProjectStatusBadge status={project.status} />
                {project.presta_type.length > 0 && (
                  <PrestaList types={project.presta_type} size="md" />
                )}
              </div>
              {project.description && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
            <CompletionScore score={project.completion_score} size={64} showLabel />
          </div>
        </CardContent>
      </Card>

      {/* Métriques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={Euro}
          label="Budget"
          value={project.budget ? `${project.budget.toLocaleString('fr-FR')} €` : '—'}
          sub="Budget total"
        />
        <MetricCard
          icon={TrendingUp}
          label="Progression"
          value={`${project.progress}%`}
          sub="Avancement général"
        />
        <MetricCard
          icon={CheckSquare}
          label="Score"
          value={`${project.completion_score}%`}
          sub="Complétude projet"
        />
        <MetricCard
          icon={Calendar}
          label="Échéance"
          value={formatDate(project.end_date)}
          sub={project.end_date ? <DeadlineBadge endDate={project.end_date} /> : '—'}
        />
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-surface-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Équipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {project.assigned_name ?? 'Non assigné'}
                </p>
                <p className="text-xs text-muted-foreground">Responsable</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Début</span>
              <span className="text-foreground font-medium">{formatDate(project.start_date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fin prévue</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">{formatDate(project.end_date)}</span>
                {project.end_date && <DeadlineBadge endDate={project.end_date} />}
              </div>
            </div>
            {project.last_activity_at && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dernière activité</span>
                <span className="text-foreground font-medium">{formatDate(project.last_activity_at)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prochaine action */}
      <NextActionCard project={project} onUpdate={handleNextActionUpdate} />

      {/* Résumé IA */}
      <AiSummaryCard project={project} onRefresh={onRefresh} />

      {/* Portail client */}
      <SharePortalButton project={project} onRefresh={onRefresh} />
    </div>
  )
}
