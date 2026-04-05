import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Target } from 'lucide-react';
import type { ProjectTemplate } from '../../projectTemplates';

interface TemplateSyncInfoProps {
  template: ProjectTemplate;
}

export function TemplateSyncInfo({ template }: TemplateSyncInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Template actuel</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{template.tasks.length}</div>
            <div className="text-sm text-primary">Tâches</div>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {template.tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)}h
            </div>
            <div className="text-sm text-green-400">Heures estimées</div>
          </div>
          <div className="text-center p-3 bg-orange-500/10 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">
              {template.tasks.filter(t => t.priority === 'high').length}
            </div>
            <div className="text-sm text-orange-400">Priorité haute</div>
          </div>
          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {[...new Set(template.tasks.map(t => t.category))].length}
            </div>
            <div className="text-sm text-purple-400">Catégories</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
