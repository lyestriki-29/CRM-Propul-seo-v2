import { Clock, Play, Pause, Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { V3Column } from '../utils/statusMapping'
import { V3_COLUMN_LABELS } from '../utils/statusMapping'

interface Props {
  column: V3Column
  count: number
  children: ReactNode
  isEmpty: boolean
}

const COLUMN_ICONS: Record<V3Column, LucideIcon> = {
  planification: Clock,
  en_cours: Play,
  en_pause: Pause,
}

const COLUMN_ICON_COLORS: Record<V3Column, string> = {
  planification: '#8B5CF6',
  en_cours: '#10b981',
  en_pause: '#f59e0b',
}

export function ProjectColumnV3({ column, count, children, isEmpty }: Props) {
  const Icon = COLUMN_ICONS[column]
  const iconColor = COLUMN_ICON_COLORS[column]

  return (
    <section className="bg-[#0f0b1e] border border-[rgba(139,92,246,0.18)] rounded-xl p-[14px] min-h-[500px] flex flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(139,92,246,0.18)]">
        <div className="flex items-center gap-2">
          <Icon className="h-[14px] w-[14px]" style={{ color: iconColor }} />
          <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#ede9fe]">
            {V3_COLUMN_LABELS[column]}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#9ca3af] bg-[#070512] px-[7px] py-0.5 rounded-[10px] tabular-nums">
          {count}
        </span>
      </div>

      {/* Cards */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 border border-dashed border-[rgba(139,92,246,0.18)] rounded-lg text-[#6b7280]">
          <Inbox className="h-7 w-7 mb-2 opacity-40" />
          <p className="text-[12px]">Aucun projet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {children}
        </div>
      )}
    </section>
  )
}
