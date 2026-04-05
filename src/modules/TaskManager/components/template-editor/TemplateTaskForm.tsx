import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Save, X } from 'lucide-react';
import { TEMPLATE_CATEGORIES, TEMPLATE_PRIORITIES } from '../../lib/templateEditorHelpers';
import type { TemplateTask } from '../../projectTemplates';

interface TemplateTaskFormProps {
  isEditing: boolean;
  newTask: Partial<TemplateTask>;
  setNewTask: (task: Partial<TemplateTask>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function TemplateTaskForm({ isEditing, newTask, setNewTask, onSave, onCancel }: TemplateTaskFormProps) {
  return (
    <Card className="border-2 border-primary/30">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={newTask.title || ''}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Titre de la tâche"
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={newTask.category}
              onValueChange={(value) => setNewTask({ ...newTask, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={newTask.priority}
              onValueChange={(value) => setNewTask({ ...newTask, priority: value as 'high' | 'medium' | 'low' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_PRIORITIES.map(priority => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center space-x-2">
                      <priority.icon className={`h-4 w-4 ${priority.color}`} />
                      <span>{priority.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hours">Heures estimées</Label>
            <Input
              id="hours"
              type="number"
              min="0"
              step="0.5"
              value={newTask.estimatedHours || ''}
              onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) || 0 })}
              placeholder="1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={newTask.description || ''}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description détaillée de la tâche"
            rows={3}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
