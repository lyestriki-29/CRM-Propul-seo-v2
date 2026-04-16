import { useState, useEffect, useMemo } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Clock } from 'lucide-react'
import type { CommTask } from '../../../../types/project-v2'
import { PRIORITY_CONFIG } from './erpTaskConfig'
import { cn } from '@/lib/utils'

interface ERPTaskBoardWeekProps {
  tasks: CommTask[]
  currentDate: Date
  onMoveTask: (taskId: string, patch: { due_date: string; due_hour: number }) => void
  onClickTask: (task: CommTask) => void
  onDateClick: (date: string) => void
}

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const GRID_COLS = '56px repeat(6, minmax(0, 1fr))'
const ROW_HEIGHT = 64

function getWeekDays(date: Date): Date[] {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return Array.from({ length: 6 }, (_, i) => {
    const dd = new Date(d)
    dd.setDate(d.getDate() + i)
    return dd
  })
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function GlassChip({
  task,
  onClick,
  compact,
}: {
  task: CommTask
  onClick: (t: CommTask) => void
  compact: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } })
  const prio = PRIORITY_CONFIG[task.priority]
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
        background: `linear-gradient(135deg, ${task.project_color}ee 0%, ${task.project_color}aa 100%)`,
        borderLeft: `3px solid ${prio.border}`,
        boxShadow: `0 2px 8px ${task.project_color}40`,
      }}
      {...attributes}
      {...listeners}
      onClick={(e) => { e.stopPropagation(); onClick(task) }}
      className={cn(
        'rounded-md cursor-pointer overflow-hidden backdrop-blur-sm hover:scale-[1.04] transition-transform flex-1 min-w-0 flex flex-col justify-center',
        compact ? 'px-1 py-0.5' : 'px-1.5 py-1'
      )}
      title={`${task.title} — ${task.due_hour ?? 9}:00`}
    >
      {!compact && (
        <div className="text-[9px] font-bold text-white/90 flex items-center gap-0.5 leading-tight">
          <Clock className="w-2.5 h-2.5 shrink-0" />
          <span>{task.due_hour ?? 9}:00</span>
        </div>
      )}
      <div className={cn('font-semibold text-white truncate leading-tight', compact ? 'text-[9px]' : 'text-[10px]')}>
        {task.title}
      </div>
    </div>
  )
}

function DroppableCell({
  id,
  isToday,
  tasks,
  onDateClick,
  onClickTask,
}: {
  id: string
  isToday: boolean
  tasks: CommTask[]
  onDateClick: (d: string) => void
  onClickTask: (t: CommTask) => void
}) {
  const dateStr = id.split('_')[0]
  const { setNodeRef, isOver } = useDroppable({ id })
  const count = tasks.length
  const compact = count >= 2
  const visible = count <= 3 ? tasks : tasks.slice(0, 2)
  const overflow = count > 3 ? count - 2 : 0

  return (
    <div
      ref={setNodeRef}
      onClick={() => onDateClick(dateStr)}
      className="border-r border-b border-white/5 last:border-r-0 p-1 cursor-pointer min-w-0 overflow-hidden transition-all"
      style={{
        height: ROW_HEIGHT,
        background: isOver
          ? 'rgba(99,102,241,0.2)'
          : isToday
            ? 'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)'
            : undefined,
        outline: isOver ? '2px dashed #818cf8' : undefined,
        outlineOffset: -2,
      }}
    >
      <div className="flex h-full gap-1">
        {visible.map(t => (
          <GlassChip key={t.id} task={t} onClick={onClickTask} compact={compact} />
        ))}
        {overflow > 0 && (
          <div
            onClick={(e) => { e.stopPropagation(); onClickTask(visible[visible.length - 1]) }}
            className="shrink-0 self-stretch flex items-center justify-center px-1 rounded-md bg-white/10 text-[9px] font-bold text-white/80 backdrop-blur-sm"
            title={`${overflow} autre(s) tache(s)`}
          >
            +{overflow}
          </div>
        )}
      </div>
    </div>
  )
}

export function ERPTaskBoardWeek({ tasks, currentDate, onMoveTask, onClickTask, onDateClick }: ERPTaskBoardWeekProps) {
  const [activeTask, setActiveTask] = useState<CommTask | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const weekDays = getWeekDays(currentDate)
  const today = new Date()
  const todayStr = toDateStr(today)

  const tasksByCell = useMemo(() => {
    return tasks.reduce<Record<string, CommTask[]>>((acc, t) => {
      if (!t.due_date) return acc
      const hour = t.due_hour ?? 9
      const key = `${t.due_date}_${hour}`
      acc[key] = acc[key] ? [...acc[key], t] : [t]
      return acc
    }, {})
  }, [tasks])

  // Ligne "now" en temps reel
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  const nowHour = now.getHours() + now.getMinutes() / 60
  const showNow = nowHour >= HOURS[0] && nowHour <= HOURS[HOURS.length - 1] + 1
  const nowTop = (nowHour - HOURS[0]) * ROW_HEIGHT

  const handleDragStart = (e: DragStartEvent) => setActiveTask(e.active.data.current?.task as CommTask)
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = e
    if (!over) return
    const task = active.data.current?.task as CommTask
    const [dateStr, hourStr] = (over.id as string).split('_')
    const hour = parseInt(hourStr, 10)
    if (task.due_date === dateStr && (task.due_hour ?? 9) === hour) return
    onMoveTask(task.id, { due_date: dateStr, due_hour: hour })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className="border border-border rounded-xl overflow-hidden relative m-4"
        style={{ background: 'linear-gradient(180deg, #0b1020 0%, #0a0e1a 100%)' }}
      >
        {/* Header jours */}
        <div
          className="grid sticky top-0 z-10 border-b border-white/10"
          style={{
            gridTemplateColumns: GRID_COLS,
            background: 'rgba(20,24,40,0.6)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="border-r border-white/5" />
          {weekDays.map((d, i) => {
            const isToday = toDateStr(d) === todayStr
            return (
              <div key={i} className="border-r border-white/5 last:border-r-0 py-2.5 text-center min-w-0">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{DAY_NAMES[i]}</div>
                <div
                  className={cn(
                    'text-lg font-bold mt-0.5 mx-auto w-8 h-8 flex items-center justify-center rounded-full',
                    isToday ? 'text-white' : 'text-white/70'
                  )}
                  style={{
                    background: isToday ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : undefined,
                    boxShadow: isToday ? '0 0 20px rgba(99,102,241,0.5)' : undefined,
                  }}
                >
                  {d.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Grille horaire */}
        <div className="grid relative" style={{ gridTemplateColumns: GRID_COLS }}>
          {HOURS.map(hour => (
            <div key={hour} className="contents">
              <div
                className="border-r border-b border-white/5 flex items-start justify-end pr-2 pt-1 text-[10px] font-mono text-white/30"
                style={{ height: ROW_HEIGHT }}
              >
                {hour}:00
              </div>
              {weekDays.map((d, i) => {
                const dateStr = toDateStr(d)
                const cellId = `${dateStr}_${hour}`
                const isToday = dateStr === todayStr
                const cellTasks = tasksByCell[cellId] ?? []
                return (
                  <DroppableCell
                    key={i}
                    id={cellId}
                    isToday={isToday}
                    tasks={cellTasks}
                    onDateClick={onDateClick}
                    onClickTask={onClickTask}
                  />
                )
              })}
            </div>
          ))}

          {/* Ligne "now" temps reel */}
          {showNow && (
            <div
              className="absolute left-14 right-0 h-px pointer-events-none z-20"
              style={{
                top: nowTop,
                background: 'linear-gradient(90deg, #ef4444 0%, rgba(239,68,68,0.3) 100%)',
                boxShadow: '0 0 8px #ef4444',
              }}
            >
              <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeTask && (
          <div
            style={{ background: activeTask.project_color }}
            className="rounded-md px-2 py-1 text-[10px] font-semibold text-white shadow-2xl rotate-2 backdrop-blur"
          >
            {activeTask.title}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
