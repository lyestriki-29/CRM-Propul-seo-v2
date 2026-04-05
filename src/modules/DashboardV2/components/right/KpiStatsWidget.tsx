import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, Users, ListChecks, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '../../../../components/ui/card'
import { Skeleton } from '../../../../components/ui/skeleton'
import type { DashboardKpis } from '../../hooks/useDashboardData'

interface KpiStatsWidgetProps {
  kpis: DashboardKpis
  loading: boolean
}

const KPI_CONFIG = [
  {
    key: 'activeProjects' as const,
    label: 'Projets actifs',
    icon: Briefcase,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    key: 'activeLeads' as const,
    label: 'Leads en cours',
    icon: Users,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    key: 'todayTasks' as const,
    label: 'Tâches du jour',
    icon: ListChecks,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    key: 'monthRevenue' as const,
    label: 'CA du mois',
    icon: TrendingUp,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    format: (v: number) => `${v.toLocaleString('fr-FR')} €`,
  },
]

export function KpiStatsWidget({ kpis, loading }: KpiStatsWidgetProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {KPI_CONFIG.map(k => (
          <Skeleton key={k.key} className="h-20 rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {KPI_CONFIG.map(({ key, label, icon: Icon, color, bg, border, format }) => (
        <Card
          key={key}
          className="rounded-2xl border bg-surface-2/50 border-border/50 hover:border-border transition-colors"
        >
          <CardContent className="p-3">
            <div className={`inline-flex p-1.5 rounded-lg ${bg} border ${border} mb-2`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={kpis[key]}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-white leading-none"
              >
                {format ? format(kpis[key] as number) : kpis[key]}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
