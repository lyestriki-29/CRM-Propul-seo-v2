import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { CommTask } from '../../../../types/project-v2'
import { CommTaskChip } from './CommTaskChip'

interface CommTaskBoardWeekProps {
  tasks: CommTask[]
  currentDate: Date
  onMoveTask: (taskId: string, patch: { due_date: string }) => void
  onClickTask: (task: CommTask) => void
  onDateClick: (date: string) => void
}

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

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

function DraggableWeekChip({ task, onClickTask }: { task: CommTask; onClickTask: (t: CommTask) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }}>
      <CommTaskChip task={task} onClick={onClickTask} isDragging={isDragging} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}

function DroppableCell({ id, isToday, children, onDateClick }: { id: string; isToday: boolean; children: React.ReactNode; onDateClick: (d: string) => void }) {
  const dateStr = id.split('_')[0]
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      onClick={() => onDateClick(dateStr)}
      className="border-r border-b border-border min-h-[52px] p-1 cursor-pointer transition-colors"
      style={{
        background: isOver ? 'rgba(99,102,241,0.1)' : isToday ? 'rgba(99,102,241,0.04)' : undefined,
        outline: isOver ? '2px dashed #6366f1' : undefined,
      }}
    >
      {children}
    </div>
  )
}

export function CommTaskBoardWeek({ tasks, currentDate, onMoveTask, onClickTask, onDateClick }: CommTaskBoardWeekProps) {
  const [activeTask, setActiveTask] = useState<CommTask | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const weekDays = getWeekDays(currentDate)
  const today = new Date()
  const todayStr = toDateStr(today)

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
    const dateStr = (over.id as string).split('_')[0]
    if (task.due_date === dateStr) return
    onMoveTask(task.id, { due_date: dateStr })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="border-l border-t border-border overflow-auto">
        {/* Header jours */}
        <div className="grid sticky top-0 z-10 bg-surface-1" style={{ gridTemplateColumns: '48px repeat(6, 1fr)' }}>
          <div className="border-r border-b border-border bg-surface-2/50" />
          {weekDays.map((d, i) => {
            const isToday = toDateStr(d) === todayStr
            return (
              <div key={i} className="border-r border-b border-border py-2.5 text-center bg-surface-2/50">
                <div className="text-[10px] font-700 text-muted-foreground/60 uppercase tracking-wider">{DAY_NAMES[i]}</div>
                <div
                  className="text-lg font-bold mt-0.5 mx-auto w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ background: isToday ? '#6366f1' : undefined, color: isToday ? '#fff' : '#e2e8f0' }}
                >
                  {d.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Grille horaire */}
        {HOURS.map(hour => (
          <div key={hour} className="grid" style={{ gridTemplateColumns: '48px repeat(6, 1fr)' }}>
            <div className="border-r border-b border-border flex items-start justify-end pr-2 pt-1 text-[10px] text-muted-foreground/40 bg-surface-2/30">
              {hour}h
            </div>
            {weekDays.map((d, i) => {
              const dateStr = toDateStr(d)
              const cellId = `${dateStr}_${hour}`
              const isToday = dateStr === todayStr
              // Afficher les tâches uniquement dans la cellule 9h de chaque jour
              const dayTasks = hour === 9 ? (tasksByDate[dateStr] ?? []) : []
              return (
                <DroppableCell key={i} id={cellId} isToday={isToday} onDateClick={onDateClick}>
                  {dayTasks.map(task => (
                    <DraggableWeekChip key={task.id} task={task} onClickTask={onClickTask} />
                  ))}
                </DroppableCell>
              )
            })}
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask && <CommTaskChip task={activeTask} onClick={() => {}} style={{ rotate: '2deg', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} />}
      </DragOverlay>
    </DndContext>
  )
}
