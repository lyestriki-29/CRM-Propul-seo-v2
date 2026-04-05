import { useState } from 'react';
import { Edit, CheckCircle, ChevronDown, Calendar } from 'lucide-react';
import type { Task } from '../../../hooks/useTasks';

function TaskCard({
  task,
  onEdit,
  onComplete,
  isMobile
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onComplete: (taskId: string) => void;
  isMobile: boolean;
}) {
  const priorityLabel = task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse';
  const priorityClass = task.priority === 'high' ? 'bg-red-500/15 text-red-400' :
    task.priority === 'medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-green-500/15 text-green-400';

  const statusLabel = task.status === 'pending' ? 'En attente' : task.status === 'in_progress' ? 'En cours' : 'Terminée';
  const statusClass = task.status === 'pending' ? 'bg-surface-2 text-foreground' :
    task.status === 'in_progress' ? 'bg-primary/15 text-primary' : 'bg-green-500/15 text-green-400';

  if (isMobile) {
    return (
      <div className="bg-surface-2/30 rounded-xl p-4 border border-border/30 active:bg-surface-2/50 transition-colors">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug flex-1">
            {task.title}
          </h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted-foreground active:bg-surface-3"
              title="Modifier"
            >
              <Edit className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => onComplete(task.id)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-green-400 active:bg-green-500/10"
              title="Terminer"
              disabled={task.status === 'completed'}
            >
              <CheckCircle className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityClass}`}>
              {priorityLabel}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
          {task.due_date && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(task.due_date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Desktop card
  return (
    <div className="bg-surface-2/30 rounded-lg p-3 border border-border/30 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
          {task.title}
        </h4>
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-muted-foreground hover:text-foreground p-1"
            title="Modifier"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => onComplete(task.id)}
            className="text-green-400 hover:text-green-300 p-1"
            title="Marquer comme terminée"
            disabled={task.status === 'completed'}
          >
            <CheckCircle className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-tight">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClass}`}>
            {priorityLabel}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
        {task.due_date && (
          <span className="text-muted-foreground">
            {new Date(task.due_date).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}

export function TaskColumns({
  users,
  getTasksForUser,
  onEdit,
  onComplete,
  isMobile
}: {
  users: any[] | undefined;
  getTasksForUser: (userId: string) => Task[];
  onEdit: (task: Task) => void;
  onComplete: (taskId: string) => void;
  isMobile: boolean;
}) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Mobile: accordion list grouped by user
  if (isMobile) {
    return (
      <div className="space-y-3">
        {users?.map((user) => {
          const userTasks = getTasksForUser(user.id);
          const isExpanded = expandedUser === user.id;

          return (
            <div key={user.id} className="glass-surface-static rounded-xl overflow-hidden">
              {/* User header - tappable accordion */}
              <button
                onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                className="w-full bg-primary text-white p-4 flex items-center justify-between active:bg-primary/90 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm">{user.name}</h3>
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {userTasks.length}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Task list - collapsible */}
              {isExpanded && (
                <div className="p-3 space-y-2">
                  {userTasks.length > 0 ? (
                    userTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEdit}
                        onComplete={onComplete}
                        isMobile={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-sm">Aucune tâche</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop: multi-column kanban
  return (
    <div className="grid gap-4 h-[calc(100vh-400px)] overflow-y-auto" style={{
      gridTemplateColumns: `repeat(${users?.length || 1}, 1fr)`
    }}>
      {users?.map((user) => (
        <div key={user.id} className="glass-surface-static rounded-xl p-3 flex flex-col h-full min-w-0">
          <div className="bg-primary text-white rounded-t-xl p-3 -mt-3 -mx-3 mb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm truncate">{user.name}</h3>
              <span className="bg-white text-primary text-xs px-2 py-1 rounded-full font-medium">
                {getTasksForUser(user.id).length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {getTasksForUser(user.id).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onComplete={onComplete}
                isMobile={false}
              />
            ))}

            {getTasksForUser(user.id).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucune tâche</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
