import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play,
  Settings,
  Eye,
  Plus,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import { 
  WEB_PROJECT_TEMPLATE, 
  getTemplateStats, 
  type ProjectTemplate,
  type TemplateTask 
} from './projectTemplates';
import { useTemplateStorage } from '../../hooks/useTemplateStorage';

interface ProjectTemplateManagerProps {
  onApplyTemplate?: (template: ProjectTemplate) => void;
  showApplyButton?: boolean;
}

export function ProjectTemplateManager({ 
  onApplyTemplate, 
  showApplyButton = true 
}: ProjectTemplateManagerProps) {
  const { getDefaultTemplate } = useTemplateStorage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Préparation']));
  
  // Utiliser le template sauvegardé ou le template par défaut
  const currentTemplate = getDefaultTemplate() || WEB_PROJECT_TEMPLATE;
  const stats = getTemplateStats(currentTemplate);
  const categories = [...new Set(currentTemplate.tasks.map(task => task.category))];
  
  const filteredTasks = selectedCategory === 'all' 
    ? currentTemplate.tasks
    : currentTemplate.tasks.filter(task => task.category === selectedCategory);
  
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/15 text-red-400 border-red-500/20';
      case 'medium': return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-green-500/15 text-green-400 border-green-500/20';
      default: return 'bg-surface-2 text-foreground border-border';
    }
  };
  
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Préparation': 'bg-primary/15 text-primary border-primary/20',
      'Structure & Design': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
      'Contenus': 'bg-green-500/15 text-green-400 border-green-500/20',
      'Fonctionnalités': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
      'Optimisations': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
      'Addons': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
      'Tests': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
      'Déploiement': 'bg-red-500/15 text-red-400 border-red-500/20',
      'Post-lancement': 'bg-surface-2 text-foreground border-border'
    };
    return colors[category] || 'bg-surface-2 text-foreground border-border';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Template Projet Web Standard</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ce template crée automatiquement {stats.totalTasks} tâches organisées en {stats.categories.length} catégories
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.totalTasks}</div>
              <div className="text-sm text-primary">Tâches totales</div>
            </div>
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{stats.totalHours}h</div>
              <div className="text-sm text-green-400">Heures estimées</div>
            </div>
            <div className="text-center p-3 bg-orange-500/10 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">{stats.highPriorityTasks}</div>
              <div className="text-sm text-orange-400">Priorité haute</div>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{stats.estimatedDuration}j</div>
              <div className="text-sm text-purple-400">Durée estimée</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          Toutes ({stats.totalTasks})
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category} ({currentTemplate.tasks.filter(t => t.category === category).length})
          </Button>
        ))}
      </div>

      {/* Bouton d'application du template */}
      {showApplyButton && onApplyTemplate && (
        <div className="flex justify-center">
          <Button 
            onClick={() => onApplyTemplate(currentTemplate)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Appliquer ce template au projet
          </Button>
        </div>
      )}

      {/* Liste des tâches par catégorie */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryTasks = currentTemplate.tasks.filter(task => task.category === category);
          const isExpanded = expandedCategories.has(category);
          
          return (
            <Card key={category} className="border-2">
              <CardHeader 
                className="cursor-pointer hover:bg-surface-3 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getCategoryColor(category)}>
                      {category}
                    </Badge>
                    <span className="font-semibold text-lg">{categoryTasks.length} tâches</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {categoryTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0)}h estimées
                    </span>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? '−' : '+'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {categoryTasks.map((task, index) => (
                      <div 
                        key={task.id}
                        className="flex items-start space-x-3 p-3 bg-surface-2/30 rounded-lg border-l-4 border-primary"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getPriorityIcon(task.priority)}
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
