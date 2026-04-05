import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableProjectCard } from './SortableProjectCard';
import { Badge } from '../../../components/ui/badge';
import type { ProjectRow } from '../../../types/supabase-types';
import type { ProjectStatus } from '../types';

interface ProjectColumnProps {
  id: ProjectStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
  projects: ProjectRow[];
  userMap?: Record<string, string>;
  onViewProject?: (project: ProjectRow) => void;
  onEditProject?: (project: ProjectRow) => void;
  onDeleteProject?: (project: ProjectRow) => void;
}

export function ProjectColumn({
  id,
  title,
  icon: Icon,
  color,
  textColor,
  projects,
  userMap,
  onViewProject,
  onEditProject,
  onDeleteProject,
}: ProjectColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      columnId: id,
    },
  });

  const projectIds = projects.map(p => p.id);

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col rounded-lg border min-w-[280px] lg:min-w-0 lg:flex-1 max-w-[350px]
        transition-all duration-200
        glass-surface-static
        ${isOver ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-1 scale-[1.01]' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${textColor}`} />
          <h3 className={`font-semibold ${textColor}`}>{title}</h3>
        </div>
        <Badge
          variant="secondary"
          className="bg-surface-2/50 text-foreground"
        >
          {projects.length}
        </Badge>
      </div>

      {/* Project list */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
          {projects.length === 0 ? (
            <div
              className={`
                flex items-center justify-center h-24
                border-2 border-dashed rounded-lg
                ${isOver
                  ? 'border-primary bg-primary/10'
                  : 'border-border'
                }
                transition-colors duration-200
              `}
            >
              <div className="text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 opacity-50 ${textColor}`} />
                <p className="text-muted-foreground text-sm">
                  {isOver ? 'Deposer ici' : 'Aucun projet'}
                </p>
              </div>
            </div>
          ) : (
            projects.map(project => (
              <SortableProjectCard
                key={project.id}
                project={project}
                userName={userMap?.[project.assigned_to || ''] }
                onView={onViewProject}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
