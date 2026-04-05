import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Settings
} from 'lucide-react';
import { 
  WEB_PROJECT_TEMPLATE, 
  getTemplateStats,
  createTasksFromTemplate,
  type TemplateTask 
} from '../TaskManager/projectTemplates';
import { useTasks } from '../../hooks/useTasks';
import { toast } from 'sonner';

interface ProjectTemplateIntegrationProps {
  projectId: string;
  projectName: string;
  onTasksCreated?: (taskCount: number) => void;
}

export function ProjectTemplateIntegration({
  projectId,
  projectName,
  onTasksCreated
}: ProjectTemplateIntegrationProps) {
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);
  const [hasAppliedTemplate, setHasAppliedTemplate] = useState(false);
  const { createTask } = useTasks();
  
  const stats = getTemplateStats(WEB_PROJECT_TEMPLATE);
  
  const handleApplyTemplate = async () => {
    if (hasAppliedTemplate) {
      toast.info('Le template a déjà été appliqué à ce projet');
      return;
    }
    
    setIsCreatingTasks(true);
    
    try {
      // Créer les tâches à partir du template
      const tasksToCreate = createTasksFromTemplate(projectId, projectName);
      
      // Créer chaque tâche dans la base de données
      const createdTasks = [];
      for (const task of tasksToCreate) {
        try {
          const result = await createTask({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            category: task.category,
            project_id: task.project_id,
            assigned_to: task.assigned_to,
            due_date: task.due_date,
            estimated_hours: task.estimated_hours
          });
          
          if (result.success) {
            createdTasks.push(result.data);
          }
        } catch (error) {
          console.error('Erreur création tâche:', error);
        }
      }
      
      if (createdTasks.length > 0) {
        setHasAppliedTemplate(true);
        toast.success(`${createdTasks.length} tâches créées avec succès pour le projet "${projectName}"`);
        onTasksCreated?.(createdTasks.length);
      } else {
        toast.error('Aucune tâche n\'a pu être créée');
      }
      
    } catch (error) {
      console.error('Erreur application template:', error);
      toast.error('Erreur lors de l\'application du template');
    } finally {
      setIsCreatingTasks(false);
    }
  };
  
  const handleCustomizeTemplate = () => {
    // TODO: Ouvrir le modal de personnalisation du template
    toast.info('Fonctionnalité de personnalisation à venir');
  };

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Template de tâches automatiques
            </h3>
            <p className="text-sm text-muted-foreground">
              Créer automatiquement toutes les tâches standard pour ce projet
            </p>
          </div>
        </div>
        
        {hasAppliedTemplate && (
          <Badge className="bg-green-500/15 text-green-400 border-green-500/20">
            <CheckCircle className="h-4 w-4 mr-1" />
            Template appliqué
          </Badge>
        )}
      </div>
      
      {/* Statistiques du template */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-surface-2/50 rounded-xl border border-primary/20">
          <div className="text-2xl font-bold text-primary">{stats.totalTasks}</div>
          <div className="text-sm text-primary">Tâches totales</div>
        </div>
        <div className="text-center p-3 bg-surface-2/50 rounded-xl border border-green-500/20">
          <div className="text-2xl font-bold text-green-400">{stats.totalHours}h</div>
          <div className="text-sm text-green-400">Heures estimées</div>
        </div>
        <div className="text-center p-3 bg-surface-2/50 rounded-xl border border-orange-500/20">
          <div className="text-2xl font-bold text-orange-400">{stats.highPriorityTasks}</div>
          <div className="text-sm text-orange-400">Priorité haute</div>
        </div>
        <div className="text-center p-3 bg-surface-2/50 rounded-xl border border-purple-500/20">
          <div className="text-2xl font-bold text-purple-400">{stats.estimatedDuration}j</div>
          <div className="text-sm text-purple-400">Durée estimée</div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!hasAppliedTemplate ? (
          <>
            <Button 
              onClick={handleApplyTemplate}
              disabled={isCreatingTasks}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
            >
              {isCreatingTasks ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Appliquer le template complet
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleCustomizeTemplate}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Settings className="h-4 w-4 mr-2" />
              Personnaliser le template
            </Button>
          </>
        ) : (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              {stats.totalTasks} tâches créées avec succès !
            </span>
          </div>
        )}
      </div>
      
      {/* Informations sur le template */}
      <div className="mt-4 p-3 bg-surface-2 rounded-lg border border-border">
        <h4 className="font-medium text-foreground mb-2">Ce template inclut :</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div>• Préparation du projet</div>
          <div>• Structure & Design</div>
          <div>• Contenus et médias</div>
          <div>• Fonctionnalités techniques</div>
          <div>• Optimisations SEO</div>
          <div>• Tests et déploiement</div>
        </div>
      </div>
    </div>
  );
}
