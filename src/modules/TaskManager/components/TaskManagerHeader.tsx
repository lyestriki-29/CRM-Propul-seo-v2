import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export function TaskManagerHeader({
  filteredTasksCount,
  error,
  clearError,
  onNewTask,
  isMobile
}: {
  filteredTasksCount: number;
  error: string | null;
  clearError: () => void;
  onNewTask: () => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          {isMobile ? 'Tâches' : 'Gestion des Tâches'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {filteredTasksCount} tâche{filteredTasksCount !== 1 ? 's' : ''}
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-500/15 text-red-400 rounded text-sm">
            {error}
            <Button
              variant="link"
              size="sm"
              className="text-red-400 p-0 h-auto ml-2"
              onClick={clearError}
            >
              ✕
            </Button>
          </div>
        )}
      </div>
      {/* Desktop only - FAB replaces this on mobile */}
      {!isMobile && (
        <Button onClick={onNewTask}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle tâche
        </Button>
      )}
    </div>
  );
}
