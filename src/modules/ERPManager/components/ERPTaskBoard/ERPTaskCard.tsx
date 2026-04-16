import type { CommTask } from '../../../../types/project-v2'
import { PRIORITY_CONFIG, STATUS_CONFIG } from './erpTaskConfig'
import { CalendarDays } from 'lucide-react'

interface ERPTaskCardProps {
  task: CommTask
  onClick: (task: CommTask) => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  isDragging?: boolean
  style?: React.CSSProperties
}

export function ERPTaskCard({ task, onClick, dragHandleProps, isDragging, style }: ERPTaskCardProps) {
  const prio = PRIORITY_CONFIG[task.priority]
  const stat = STATUS_CONFIG[task.status]

  return (
    <div
      onClick={() => onClick(task)}
      style={{ ...style, borderLeft: `3px solid ${prio.border}`, opacity: isDragging ? 0.4 : 1 }}
      className="bg-surface-1 border border-border rounded-lg p-3 cursor-pointer hover:bg-surface-3 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-foreground leading-snug flex-1">{task.title}</p>
        {dragHandleProps && (
          <div {...dragHandleProps} className="text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing px-0.5" onClick={e => e.stopPropagation()}>
            ⠿
          </div>
        )}
      </div>
      {task.due_date && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
          <CalendarDays className="w-3 h-3" />
          {new Date(task.due_date + 'T00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-600 ${prio.badgeBg} ${prio.badge}`}>
          {prio.label}
        </span>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] ${stat.badgeBg} ${stat.badge}`}>
          {stat.label}
        </span>
      </div>
    </div>
  )
}
