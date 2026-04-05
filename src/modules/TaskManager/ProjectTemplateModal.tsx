import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { 
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Play,
  Settings
} from 'lucide-react';
import { 
  WEB_PROJECT_TEMPLATE, 
  getTemplateStats,
  type ProjectTemplate,
  type TemplateTask 
} from './projectTemplates';

interface ProjectTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onApplyTemplate: (selectedTasks: TemplateTask[], projectId: string, projectName: string) => void;
  projectId: string;
  projectName: string;
}

export function ProjectTemplateModal({
  open,
  onClose,
  onApplyTemplate,
  projectId,
  projectName
}: ProjectTemplateModalProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set(WEB_PROJECT_TEMPLATE.tasks.map(t => t.id)));
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(['Préparation', 'Structure & Design']));
  
  const stats = getTemplateStats(WEB_PROJECT_TEMPLATE);
  const categories = [...new Set(WEB_PROJECT_TEMPLATE.tasks.map(task => task.category))];
  
  const toggleTask = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };
  
  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
    
    // Mettre à jour les tâches sélectionnées
    const categoryTasks = WEB_PROJECT_TEMPLATE.tasks.filter(task => task.category === category);
    const newSelectedTasks = new Set(selectedTasks);
    
    if (newSelected.has(category)) {
      // Désélectionner toutes les tâches de cette catégorie
      categoryTasks.forEach(task => newSelectedTasks.delete(task.id));
    } else {
      // Sélectionner toutes les tâches de cette catégorie
      categoryTasks.forEach(task => newSelectedTasks.add(task.id));
    }
    setSelectedTasks(newSelectedTasks);
  };
  
  const selectAll = () => {
    setSelectedTasks(new Set(WEB_PROJECT_TEMPLATE.tasks.map(t => t.id)));
    setSelectedCategories(new Set(categories));
  };
  
  const selectNone = () => {
    setSelectedTasks(new Set());
    setSelectedCategories(new Set());
  };
  
  const getSelectedStats = () => {
    const selected = WEB_PROJECT_TEMPLATE.tasks.filter(task => selectedTasks.has(task.id));
    const totalHours = selected.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    const highPriority = selected.filter(task => task.priority === 'high').length;
    
    return {
      totalTasks: selected.length,
      totalHours,
      highPriority,
      estimatedDuration: Math.ceil(totalHours / 8)
    };
  };
  
  const handleApply = () => {
    const tasksToApply = WEB_PROJECT_TEMPLATE.tasks.filter(task => selectedTasks.has(task.id));
    onApplyTemplate(tasksToApply, projectId, projectName);
    onClose();
  };
  
  const selectedStats = getSelectedStats();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Template de tâches pour "{projectName}"</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statistiques des tâches sélectionnées */}
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedStats.totalTasks}</div>
                <div className="text-sm text-primary">Tâches sélectionnées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{selectedStats.totalHours}h</div>
                <div className="text-sm text-green-400">Heures estimées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{selectedStats.highPriority}</div>
                <div className="text-sm text-orange-400">Priorité haute</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{selectedStats.estimatedDuration}j</div>
                <div className="text-sm text-purple-400">Durée estimée</div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Tout sélectionner
            </Button>
            <Button variant="outline" size="sm" onClick={selectNone}>
              <AlertCircle className="h-4 w-4 mr-2" />
              Tout désélectionner
            </Button>
          </div>

          {/* Sélection par catégorie */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Sélection par catégorie</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map(category => {
                const categoryTasks = WEB_PROJECT_TEMPLATE.tasks.filter(task => task.category === category);
                const selectedInCategory = categoryTasks.filter(task => selectedTasks.has(task.id)).length;
                const isSelected = selectedCategories.has(category);
                
                return (
                  <div
                    key={category}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-border'
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{category}</span>
                      <Checkbox checked={isSelected} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedInCategory}/{categoryTasks.length} tâches sélectionnées
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Détail des tâches par catégorie */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Détail des tâches</h3>
            {categories.map(category => {
              const categoryTasks = WEB_PROJECT_TEMPLATE.tasks.filter(task => task.category === category);
              const hasSelectedTasks = categoryTasks.some(task => selectedTasks.has(task.id));
              
              if (!hasSelectedTasks) return null;
              
              return (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-3 text-foreground">{category}</h4>
                  <div className="space-y-2">
                    {categoryTasks.map(task => (
                      <div
                        key={task.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 transition-colors ${
                          selectedTasks.has(task.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-muted/50 opacity-50'
                        }`}
                      >
                        <Checkbox
                          checked={selectedTasks.has(task.id)}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-foreground">{task.title}</h5>
                            <Badge
                              variant="outline"
                              className={`${
                                task.priority === 'high' ? 'border-red-500/20 text-red-400 bg-red-500/15' :
                                task.priority === 'medium' ? 'border-amber-500/20 text-amber-400 bg-amber-500/15' :
                                'border-green-500/20 text-green-400 bg-green-500/15'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                            {task.estimatedHours && (
                              <Badge variant="secondary" className="bg-primary/15 text-primary">
                                <Clock className="h-3 w-3 mr-1" />
                                {task.estimatedHours}h
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          
                          {task.dependencies && task.dependencies.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">Dépend de :</span> {task.dependencies.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedStats.totalTasks} tâches sélectionnées • {selectedStats.totalHours}h estimées
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleApply}
              disabled={selectedStats.totalTasks === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Créer {selectedStats.totalTasks} tâches
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
