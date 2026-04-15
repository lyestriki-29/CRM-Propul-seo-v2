import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { CommTask, ProjectV2, StatusComm } from '../../../../types/project-v2'
import { CommTaskCard } from './CommTaskCard'

type CommProject = ProjectV2 & { comm_status: StatusComm }

interface CommTaskBoardProjectProps {
  tasks: CommTask[]
  projects: CommProject[]
  onMoveTask: (taskId: string, patch: { project_id: string; project_name: string; project_color: string }) => void
  onClickTask: (task: CommTask) => void
  onAddTask: (projectId: string) => void
}

const PROJECT_COLORS: Record<string, string> = {
  'comm-001': '#e879f9',
  'comm-002': '#10b981',
  'comm-003': '#818cf8',
  'comm-004': '#f87171',
  'comm-005': '#34d399',
  'comm-006': '#38bdf8',
}

// --- Draggable card wrapper ---
function DraggableCard({ task, onClickTask }: { task: CommTask; onClickTask: (t: CommTask) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform) }}>
      <CommTaskCard
        task={task}
        onClick={onClickTask}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

// --- Droppable column wrapper ---
function DroppableColumn({ projectId, children }: { projectId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${projectId}` })
  return (
    <div
      ref={setNodeRef}
      className="bg-surface-2 rounded-b-lg border border-t-0 border-border p-2 min-h-32 flex flex-col gap-2 transition-colors"
      style={{ background: isOver ? 'rgba(99,102,241,0.08)' : undefined, outline: isOver ? '2px dashed #6366f1' : undefined }}
    >
      {children}
    </div>
  )
}

export function CommTaskBoardProject({ tasks, projects, onMoveTask, onClickTask, onAddTask }: CommTaskBoardProjectProps) {
  const [activeTask, setActiveTask] = useState<CommTask | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleDragStart = (e: DragStartEvent) => {
    setActiveTask(e.active.data.current?.task as CommTask)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = e
    if (!over) return
    const task = active.data.current?.task as CommTask
    const colId = over.id as string // "col-{projectId}"
    const projectId = colId.replace('col-', '')
    if (task.project_id === projectId) return
    const proj = projects.find(p => p.id === projectId)
    if (!proj) return
    onMoveTask(task.id, {
      project_id: proj.id,
      project_name: proj.name,
      project_color: PROJECT_COLORS[proj.id] ?? '#6366f1',
    })
  }

  // Projets comm actifs uniquement (hors perdu/termine)
  const activeProjects = projects.filter(p => !['perdu', 'termine'].includes(p.comm_status))

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className="grid gap-3 p-4 pb-6"
        style={{ gridTemplateColumns: `repeat(${activeProjects.length}, minmax(0, 1fr))` }}
      >
        {activeProjects.map(proj => {
          const color = PROJECT_COLORS[proj.id] ?? '#6366f1'
          const colTasks = tasks.filter(t => t.project_id === proj.id)
          return (
            <div key={proj.id} className="min-w-0">
              {/* Header colonne */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-t-lg overflow-hidden"
                style={{ background: color + '22', borderBottom: `2px solid ${color}` }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-xs font-bold truncate min-w-0" style={{ color }}>{proj.name}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-auto" style={{ background: color + '33', color }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Corps droppable */}
              <DroppableColumn projectId={proj.id}>
                {colTasks.map(task => (
                  <DraggableCard key={task.id} task={task} onClickTask={onClickTask} />
                ))}
                <button
                  onClick={() => onAddTask(proj.id)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-muted-foreground/40 hover:text-muted-foreground text-xs transition-colors rounded-md hover:bg-surface-3"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </DroppableColumn>
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask && <CommTaskCard task={activeTask} onClick={() => {}} isDragging={false} style={{ rotate: '2deg', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }} />}
      </DragOverlay>
    </DndContext>
  )
}
