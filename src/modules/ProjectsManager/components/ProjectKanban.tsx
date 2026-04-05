import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ProjectColumn } from './ProjectColumn';
import { ProjectCard } from './ProjectCard';
import { useProjectDragDrop } from '../hooks/useProjectDragDrop';
import type { ProjectRow } from '../../../types/supabase-types';

interface ProjectKanbanProps {
  projects: ProjectRow[];
  userMap?: Record<string, string>;
  onRefresh: () => void;
  onViewProject: (project: ProjectRow) => void;
  onEditProject: (project: ProjectRow) => void;
  onDeleteProject: (project: ProjectRow) => void;
}

export function ProjectKanban({
  projects,
  userMap,
  onRefresh,
  onViewProject,
  onEditProject,
  onDeleteProject,
}: ProjectKanbanProps) {
  const {
    columns,
    activeProject,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useProjectDragDrop({
    initialProjects: projects,
    onUpdate: onRefresh,
  });

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Configure measuring strategy
  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      accessibility={{
        announcements: {
          onDragStart({ active }) {
            const project = projects.find(p => p.id === active.id);
            return `Projet "${project?.name || active.id}" selectionne. Utilisez les fleches pour le deplacer.`;
          },
          onDragOver({ active, over }) {
            const project = projects.find(p => p.id === active.id);
            if (over) {
              const overProject = projects.find(p => p.id === over.id);
              if (overProject) {
                return `Projet au-dessus de "${overProject.name}"`;
              }
              return `Projet au-dessus de la colonne ${over.id}`;
            }
            return `Projet "${project?.name}" en dehors de toute zone`;
          },
          onDragEnd({ active, over }) {
            const project = projects.find(p => p.id === active.id);
            if (over) {
              return `Projet "${project?.name}" deplace`;
            }
            return `Projet "${project?.name}" remis a sa position initiale`;
          },
          onDragCancel({ active }) {
            const project = projects.find(p => p.id === active.id);
            return `Deplacement du projet "${project?.name}" annule`;
          },
        },
      }}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {columns.map(column => (
          <ProjectColumn
            key={column.id}
            id={column.id}
            title={column.title}
            icon={column.icon}
            color={column.color}
            textColor={column.textColor}
            projects={column.projects}
            userMap={userMap}
            onViewProject={onViewProject}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
          />
        ))}
      </div>

      {/* Drag overlay - shows the dragged card */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {activeProject ? (
          <ProjectCard project={activeProject} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
