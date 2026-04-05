import { Euro, TrendingUp, CheckSquare, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DeadlineBadge } from '../../ProjectsManagerV2/components/DeadlineBadge'
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

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const formatDate = (d: string | null) =>
    d ? format(parseISO(d), 'd MMM yyyy', { locale: fr }) : '—'

  return (
    <div className="space-y-4">
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
    </div>
  )
}
