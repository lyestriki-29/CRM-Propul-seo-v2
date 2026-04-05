import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProjectCard } from './ProjectCard';
import type { ProjectRow } from '../../../types/supabase-types';

interface SortableProjectCardProps {
  project: ProjectRow;
  userName?: string;
  onView?: (project: ProjectRow) => void;
  onEdit?: (project: ProjectRow) => void;
  onDelete?: (project: ProjectRow) => void;
}

export function SortableProjectCard({
  project,
  userName,
  onView,
  onEdit,
  onDelete,
}: SortableProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    data: {
      type: 'project',
      project,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ProjectCard
        project={project}
        isDragging={isDragging}
        userName={userName}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
