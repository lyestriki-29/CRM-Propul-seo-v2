import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Clock, Play, Pause } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import type { ProjectRow } from '../../../types/supabase-types';
import type { ProjectStatus, KanbanColumn } from '../types';

interface UseProjectDragDropProps {
  initialProjects: ProjectRow[];
  onUpdate?: () => void;
}

interface UseProjectDragDropReturn {
  columns: KanbanColumn[];
  activeProject: ProjectRow | null;
  activeColumn: ProjectStatus | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  handleDragCancel: () => void;
  setProjects: React.Dispatch<React.SetStateAction<ProjectRow[]>>;
}

const COLUMN_CONFIG = [
  {
    id: 'planning' as ProjectStatus,
    title: 'Planification',
    icon: Clock,
    color: 'bg-primary/10 border-primary/30',
    textColor: 'text-primary',
  },
  {
    id: 'in_progress' as ProjectStatus,
    title: 'En cours',
    icon: Play,
    color: 'bg-green-900/30 border-green-800',
    textColor: 'text-green-300',
  },
  {
    id: 'on_hold' as ProjectStatus,
    title: 'En pause',
    icon: Pause,
    color: 'bg-yellow-900/30 border-yellow-800',
    textColor: 'text-yellow-300',
  },
];

export function useProjectDragDrop({
  initialProjects,
  onUpdate
}: UseProjectDragDropProps): UseProjectDragDropReturn {
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);
  const [activeProject, setActiveProject] = useState<ProjectRow | null>(null);
  const [activeColumn, setActiveColumn] = useState<ProjectStatus | null>(null);

  // Synchronize projects when initialProjects changes
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // Organize projects by column
  const columns = useMemo<KanbanColumn[]>(() => {
    return COLUMN_CONFIG.map(col => ({
      ...col,
      projects: projects
        .filter(p => {
          // Handle 'paused' status mapping to 'on_hold'
          const projectStatus = p.status === 'paused' ? 'on_hold' : p.status;
          return projectStatus === col.id;
        })
        .sort((a, b) => (a.progress || 0) - (b.progress || 0)),
    }));
  }, [projects]);

  // Find column for a project
  const findColumn = useCallback((projectId: UniqueIdentifier): ProjectStatus | null => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    // Handle 'paused' mapping
    return (project.status === 'paused' ? 'on_hold' : project.status) as ProjectStatus;
  }, [projects]);

  // Drag start handler
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const project = projects.find(p => p.id === active.id);

    if (project) {
      setActiveProject(project);
      const status = (project.status === 'paused' ? 'on_hold' : project.status) as ProjectStatus;
      setActiveColumn(status);
    }
  }, [projects]);

  // Drag over handler - for preview during drag
  const handleDragOver = useCallback((event: DragOverEvent) => {
    // No optimistic updates - wait for database confirmation
    // This prevents sync issues between local state and Supabase
  }, []);

  // Drag end handler - persist changes
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    const currentActiveProject = activeProject;
    const currentActiveColumn = activeColumn;

    setActiveProject(null);
    setActiveColumn(null);

    if (!over) {
      // Drag cancelled - refresh to reset state
      onUpdate?.();
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Use the original column stored at drag start, not the optimistic update
    const activeColumnId = currentActiveColumn;
    let overColumnId = findColumn(overId);

    // Check if dropped on a column directly
    if (!overColumnId && COLUMN_CONFIG.some(col => col.id === overId)) {
      overColumnId = overId as ProjectStatus;
    }

    if (!activeColumnId || !overColumnId) {
      onUpdate?.();
      return;
    }

    // Same column - reorder (only if position column exists)
    if (activeColumnId === overColumnId) {
      const columnProjects = projects.filter(p => {
        const status = (p.status === 'paused' ? 'on_hold' : p.status) as ProjectStatus;
        return status === activeColumnId;
      });

      const oldIndex = columnProjects.findIndex(p => p.id === activeId);
      const newIndex = columnProjects.findIndex(p => p.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(columnProjects, oldIndex, newIndex);

        // Update position in database if position column exists
        try {
          const updates = reordered.map((project, index) => ({
            id: project.id,
            position: index
          }));

          // Update positions in batch
          await Promise.all(
            updates.map(update =>
              supabase
                .from('projects')
                .update({ position: update.position })
                .eq('id', update.id)
            )
          );

          // Update local state
          setProjects(prev => {
            const otherProjects = prev.filter(p => {
              const status = (p.status === 'paused' ? 'on_hold' : p.status) as ProjectStatus;
              return status !== activeColumnId;
            });
            return [...otherProjects, ...reordered];
          });
        } catch (error) {
          console.error('Error updating project positions:', error);
        }
      }
      return;
    }

    // Different column - update status in database
    try {
      // Map on_hold back to the database status
      const dbStatus = overColumnId === 'on_hold' ? 'on_hold' : overColumnId;

      const { error } = await supabase
        .from('projects')
        .update({
          status: dbStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeId);

      if (error) {
        console.error('Error updating project status:', error);
        toast.error('Erreur lors du changement de statut');
        onUpdate?.(); // Refresh to reset state
        return;
      }

      toast.success('Statut du projet mis a jour');
      onUpdate?.();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Erreur lors du changement de statut');
      onUpdate?.();
    }
  }, [activeProject, activeColumn, findColumn, projects, onUpdate]);

  // Drag cancel handler
  const handleDragCancel = useCallback(() => {
    setActiveProject(null);
    setActiveColumn(null);
    onUpdate?.(); // Refresh to reset any optimistic updates
  }, [onUpdate]);

  return {
    columns,
    activeProject,
    activeColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    setProjects,
  };
}
