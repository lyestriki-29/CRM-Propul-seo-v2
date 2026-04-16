import type { CommTask } from '../../../../types/project-v2'
import { PRIORITY_CONFIG, projectAbbr } from './erpTaskConfig'

interface ERPTaskChipProps {
  task: CommTask
  onClick: (task: CommTask) => void
  isDragging?: boolean
  style?: React.CSSProperties
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
}

export function ERPTaskChip({ task, onClick, isDragging, style, dragHandleProps }: ERPTaskChipProps) {
  const prio = PRIORITY_CONFIG[task.priority]

  return (
    <div
      onClick={() => onClick(task)}
      style={{
        ...style,
        borderLeftColor: prio.border,
        background: prio.bg,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="flex items-center gap-1 px-1.5 py-0.5 rounded border-l-2 mb-1 cursor-pointer hover:-translate-y-px hover:shadow-md transition-all select-none overflow-hidden"
      {...dragHandleProps}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: prio.dot }} />
      <span className="text-[10px] font-medium text-foreground truncate flex-1 min-w-0">{task.title}</span>
      <span
        className="text-[8px] font-bold px-1 py-px rounded shrink-0"
        style={{ background: task.project_color + '22', color: task.project_color, border: `1px solid ${task.project_color}44` }}
      >
        {projectAbbr(task.project_name)}
      </span>
    </div>
  )
}
