import { Card, CardContent, CardHeader } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Edit, Trash2, Clock } from 'lucide-react';
import { getPriorityColor, getCategoryColor, TEMPLATE_PRIORITIES } from '../../lib/templateEditorHelpers';
import type { TemplateTask } from '../../projectTemplates';

interface TemplateCategoryListProps {
  groupedTasks: Record<string, TemplateTask[]>;
  onEditTask: (task: TemplateTask) => void;
  onDeleteTask: (taskId: string) => void;
}

function PriorityIcon({ priority }: { priority: string }) {
  const priorityConfig = TEMPLATE_PRIORITIES.find(p => p.value === priority);
  if (priorityConfig) {
    const Icon = priorityConfig.icon;
    return <Icon className={`h-4 w-4 ${priorityConfig.color}`} />;
  }
  return <Clock className="h-4 w-4 text-muted-foreground" />;
}

export function TemplateCategoryList({ groupedTasks, onEditTask, onDeleteTask }: TemplateCategoryListProps) {
  return (
    <div className="space-y-4">
      {Object.entries(groupedTasks).map(([category, tasks]) => (
        <Card key={category} className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className={getCategoryColor(category)}>
                  {category}
                </Badge>
                <span className="font-semibold text-lg">{tasks.length} tâches</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)}h estimées
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 bg-surface-2/30 rounded-lg border-l-4 border-primary"
                >
                  <div className="flex-shrink-0 mt-1">
                    <PriorityIcon priority={task.priority} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
                        {task.priority}
                      </Badge>
                      {task.estimatedHours && (
                        <Badge variant="secondary" className="bg-primary/15 text-primary">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.estimatedHours}h
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>

                    {task.dependencies && task.dependencies.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Dépend de :</span> {task.dependencies.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTask(task)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTask(task.id)}
                      title="Supprimer"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
