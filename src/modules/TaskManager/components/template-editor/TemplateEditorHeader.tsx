import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Settings, Save, X } from 'lucide-react';
import type { ProjectTemplate, TemplateTask } from '../../projectTemplates';

interface TemplateEditorHeaderProps {
  template: ProjectTemplate;
  groupedTasks: Record<string, TemplateTask[]>;
  onReset: () => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function TemplateEditorHeader({ template, groupedTasks, onReset, onSave, onCancel }: TemplateEditorHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Éditeur de Template</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Modifiez la to-do list automatique des projets
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onReset}
              className="text-orange-400 border-orange-500/20 hover:bg-orange-500/10"
            >
              <Settings className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{template.tasks.length}</div>
            <div className="text-sm text-primary">Tâches totales</div>
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
              {Object.keys(groupedTasks).length}
            </div>
            <div className="text-sm text-purple-400">Catégories</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
