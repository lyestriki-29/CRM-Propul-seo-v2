import { memo } from 'react';
import { Calendar, Euro, GripVertical, Eye, Edit, Trash2, User } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import type { ProjectRow } from '../../../types/supabase-types';

interface ProjectCardProps {
  project: ProjectRow;
  isDragging?: boolean;
  userName?: string;
  onView?: (project: ProjectRow) => void;
  onEdit?: (project: ProjectRow) => void;
  onDelete?: (project: ProjectRow) => void;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  isDragging = false,
  userName,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-primary';
    if (progress >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card
      className={`
        group cursor-grab active:cursor-grabbing
        border border-border/50
        transition-all duration-200
        bg-surface-2/80
        ${isDragging
          ? 'shadow-xl rotate-2 scale-105 opacity-90 border-primary/50'
          : 'hover:border-border hover:shadow-md'
        }
      `}
    >
      <CardContent className="p-3">
        {/* Header with grip and title */}
        <div className="flex items-start gap-2 mb-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
              {project.name}
            </h4>
            {project.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-1.5 mb-3">
          {project.budget !== null && project.budget !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Euro className="h-3 w-3 flex-shrink-0" />
              <span>{project.budget.toLocaleString('fr-FR')} EUR</span>
            </div>
          )}

          {userName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{userName}</span>
            </div>
          )}

          {project.end_date && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>{formatDate(project.end_date)}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Avancement</span>
            <span className="text-xs font-medium text-foreground">{project.progress || 0}%</span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onView && (
            <button
              onClick={(e) => { e.stopPropagation(); onView(project); }}
              className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded bg-surface-3 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors"
            >
              <Eye className="h-3 w-3" />
              Voir
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="p-1.5 rounded bg-surface-3 hover:bg-blue-500/20 hover:text-blue-300 text-muted-foreground transition-colors"
            >
              <Edit className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project); }}
              className="p-1.5 rounded bg-surface-3 hover:bg-red-500/20 hover:text-red-300 text-muted-foreground transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
