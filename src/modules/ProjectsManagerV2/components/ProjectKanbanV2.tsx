import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, MeasuringStrategy } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { ProjectColumnV2 } from './ProjectColumnV2'
import { ProjectCardV2 } from './ProjectCardV2'
import { useProjectDragDropV2 } from '../hooks/useProjectDragDropV2'
import type { ProjectV2, ProjectStatusV2 } from '../../../types/project-v2'

interface ProjectKanbanV2Props {
  projects: ProjectV2[]
  onStatusChange: (id: string, newStatus: ProjectStatusV2) => void
  onViewProject: (project: ProjectV2) => void
  onEditProject: (project: ProjectV2) => void
  onDeleteProject: (project: ProjectV2) => void
}

export function ProjectKanbanV2({ projects, onStatusChange, onViewProject, onEditProject, onDeleteProject }: ProjectKanbanV2Props) {
  const { columns, activeProject, handleDragStart, handleDragOver, handleDragEnd, handleDragCancel } =
    useProjectDragDropV2({ projects, onStatusChange })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart} onDragOver={handleDragOver}
      onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="flex gap-3 overflow-x-auto pb-4 h-full snap-x snap-mandatory">
        {columns.map(column => (
          <ProjectColumnV2 key={column.id} id={column.id} title={column.title}
            icon={column.icon} color={column.color} textColor={column.textColor}
            projects={column.projects} onViewProject={onViewProject}
            onEditProject={onEditProject} onDeleteProject={onDeleteProject} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeProject ? <ProjectCardV2 project={activeProject} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
