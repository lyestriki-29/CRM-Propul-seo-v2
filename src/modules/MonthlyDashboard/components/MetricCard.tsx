import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  color?: 'default' | 'green' | 'amber' | 'red'
}

const colorMap = {
  default: 'text-foreground',
  green:   'text-emerald-400',
  amber:   'text-amber-400',
  red:     'text-red-400',
}

export function MetricCard({ icon: Icon, label, value, sub, color = 'default' }: MetricCardProps) {
  return (
    <div className="bg-surface-2 rounded-xl p-4 border border-border flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}
