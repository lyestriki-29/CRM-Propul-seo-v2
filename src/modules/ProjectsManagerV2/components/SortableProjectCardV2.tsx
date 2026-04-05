import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ProjectCardV2 } from './ProjectCardV2'
import type { ProjectV2 } from '../../../types/project-v2'

interface SortableProjectCardV2Props {
  project: ProjectV2
  onView?: (project: ProjectV2) => void
  onEdit?: (project: ProjectV2) => void
  onDelete?: (project: ProjectV2) => void
}

export function SortableProjectCardV2({ project, onView, onEdit, onDelete }: SortableProjectCardV2Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    data: { type: 'project', project },
  })
  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 1000 : 1 }}
      {...attributes} {...listeners}>
      <ProjectCardV2 project={project} isDragging={isDragging} onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}
