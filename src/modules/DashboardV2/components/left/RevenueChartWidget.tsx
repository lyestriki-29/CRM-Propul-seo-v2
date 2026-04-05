import { useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Skeleton } from '../../../../components/ui/skeleton'

interface RevenueDataPoint {
  monthKey: string
  revenue: number
}

interface RevenueChartWidgetProps {
  data: RevenueDataPoint[]
  loading: boolean
}

export function RevenueChartWidget({ data, loading }: RevenueChartWidgetProps) {
  const chartData = useMemo(() =>
    data.map(d => ({
      month: format(new Date(d.monthKey + '-01'), 'MMM', { locale: fr }),
      fullMonth: format(new Date(d.monthKey + '-01'), 'MMMM yyyy', { locale: fr }),
      revenue: d.revenue,
    })),
    [data]
  )

  if (loading) return <Skeleton className="hidden md:block h-48 rounded-2xl" />

  return (
    <div className="hidden md:block rounded-2xl bg-gradient-to-br from-surface-2 to-surface-2/50 border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <TrendingUp className="h-4 w-4 text-violet-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">CA mensuel</h3>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#71717a' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k€`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
            formatter={(v: number) => [`${v.toLocaleString('fr-FR')} €`, 'CA']}
            labelFormatter={(_label: unknown, payload: unknown[]) => {
              const p = payload as Array<{ payload?: { fullMonth: string } }>
              return p?.[0]?.payload?.fullMonth ?? ''
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#9334e9"
            strokeWidth={2.5}
            dot={{ fill: '#9334e9', r: 3 }}
            activeDot={{ r: 5, fill: '#9334e9' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
