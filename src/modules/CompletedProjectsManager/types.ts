// Types spécifiques au module CompletedProjectsManager

export interface CompletedProject {
  id: string;
  name: string;
  client: string;
  endDate: string;
  status: 'completed' | 'archived';
} 