import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { CommTask } from '../../../../types/project-v2'
import { ERPTaskChip } from './ERPTaskChip'

interface ERPTaskBoardMonthProps {
  tasks: CommTask[]
  currentDate: Date
  onMoveTask: (taskId: string, patch: { due_date: string }) => void
  onClickTask: (task: CommTask) => void
  onDateClick: (date: string) => void
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // 0=Mon
}
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function DraggableChip({ task, onClickTask }: { task: CommTask; onClickTask: (t: CommTask) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }}>
      <ERPTaskChip task={task} onClick={onClickTask} isDragging={isDragging} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}

function DroppableDay({ dateStr, isToday, isOther, children, onDateClick }: {
  dateStr: string; isToday: boolean; isOther: boolean; children: React.ReactNode; onDateClick: (d: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dateStr })
  return (
    <div
      ref={setNodeRef}
      onClick={() => onDateClick(dateStr)}
      className="border-r border-b border-border min-h-[100px] p-1.5 cursor-pointer transition-colors"
      style={{
        background: isOver ? 'rgba(99,102,241,0.1)' : isToday ? 'rgba(99,102,241,0.04)' : undefined,
        outline: isOver ? '2px dashed #6366f1' : undefined,
        opacity: isOther ? 0.3 : 1,
      }}
    >
      {children}
    </div>
  )
}

const DAY_HEADERS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function ERPTaskBoardMonth({ tasks, currentDate, onMoveTask, onClickTask, onDateClick }: ERPTaskBoardMonthProps) {
  const [activeTask, setActiveTask] = useState<CommTask | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const daysInMonth  = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)
  const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1)

  // Build grid cells
  const cells: { dateStr: string; dayNum: number; isOther: boolean }[] = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    const d = prevMonthDays - firstDayOfMonth + 1 + i
    cells.push({ dateStr: toDateStr(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, d), dayNum: d, isOther: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ dateStr: toDateStr(year, month, d), dayNum: d, isOther: false })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ dateStr: toDateStr(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, d), dayNum: d, isOther: true })
  }

  const tasksByDate = tasks.reduce<Record<string, CommTask[]>>((acc, t) => {
    if (!t.due_date) return acc
    acc[t.due_date] = acc[t.due_date] ? [...acc[t.due_date], t] : [t]
    return acc
  }, {})

  const handleDragStart = (e: DragStartEvent) => setActiveTask(e.active.data.current?.task as CommTask)
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = e
    if (!over) return
    const task = active.data.current?.task as CommTask
    const newDate = over.id as string
    if (task.due_date === newDate) return
    onMoveTask(task.id, { due_date: newDate })
  }

  const MAX_VISIBLE = 2

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="border-l border-t border-border">
        {/* Headers */}
        <div className="grid grid-cols-7">
          {DAY_HEADERS.map(d => (
            <div key={d} className="py-2 text-center text-[10px] font-700 text-muted-foreground/60 uppercase tracking-wider border-r border-b border-border bg-surface-2/50">
              {d}
            </div>
          ))}
        </div>
        {/* Cells */}
        <div className="grid grid-cols-7">
          {cells.map(({ dateStr, dayNum, isOther }) => {
            const isToday = dateStr === todayStr
            const dayTasks = tasksByDate[dateStr] ?? []
            const isExpanded = expanded[dateStr]
            const visible = isExpanded ? dayTasks : dayTasks.slice(0, MAX_VISIBLE)
            const hidden = dayTasks.length - MAX_VISIBLE

            return (
              <DroppableDay key={dateStr} dateStr={dateStr} isToday={isToday} isOther={isOther} onDateClick={onDateClick}>
                {/* Numero du jour */}
                <span
                  className="inline-flex items-center justify-center text-[11px] font-semibold mb-1 w-5 h-5"
                  style={{
                    color: isToday ? '#fff' : '#475569',
                    background: isToday ? '#6366f1' : undefined,
                    borderRadius: isToday ? '50%' : undefined,
                  }}
                >
                  {dayNum}
                </span>
                {/* Chips taches */}
                {visible.map(task => (
                  <DraggableChip key={task.id} task={task} onClickTask={onClickTask} />
                ))}
                {!isExpanded && hidden > 0 && (
                  <button
                    onClick={e => { e.stopPropagation(); setExpanded(p => ({ ...p, [dateStr]: true })) }}
                    className="text-[9px] text-primary font-semibold px-1"
                  >
                    +{hidden} autres
                  </button>
                )}
              </DroppableDay>
            )
          })}
        </div>
      </div>

      <DragOverlay>
        {activeTask && <ERPTaskChip task={activeTask} onClick={() => {}} style={{ rotate: '3deg', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} />}
      </DragOverlay>
    </DndContext>
  )
}
