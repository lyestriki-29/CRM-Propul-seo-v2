// Types spécifiques au module ProjectsManager

import { ProjectRow } from '../../types/supabase-types';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
}

// ===== TYPES DRAG & DROP =====

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';

export interface KanbanColumn {
  id: ProjectStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
  projects: ProjectRow[];
}

export interface DragData {
  type: 'project';
  project: ProjectRow;
  columnId: ProjectStatus;
}

export interface DropResult {
  projectId: string;
  sourceColumn: ProjectStatus;
  targetColumn: ProjectStatus;
  newIndex: number;
}
