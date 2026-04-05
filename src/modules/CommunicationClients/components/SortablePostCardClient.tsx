import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCardClient } from './KanbanCardClient';
import type { PostRow } from '../types';

interface SortablePostCardClientProps {
  post: PostRow;
  onView?: (post: PostRow) => void;
  onEdit?: (post: PostRow) => void;
  onDelete?: (post: PostRow) => void;
}

export function SortablePostCardClient({ post, onView, onEdit, onDelete }: SortablePostCardClientProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: post.id,
    data: { type: 'post', post },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCardClient post={post} isDragging={isDragging} onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
