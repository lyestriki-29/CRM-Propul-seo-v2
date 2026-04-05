import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Target,
  Play,
  Settings,
  Eye,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ProjectTemplateManager } from './ProjectTemplateManager';
import { ProjectTemplateModal } from './ProjectTemplateModal';
import { 
  WEB_PROJECT_TEMPLATE, 
  getTemplateStats,
  type ProjectTemplate,
  type TemplateTask 
} from './projectTemplates';
import { Badge } from '../../components/ui/badge';

interface TaskTemplateSystemProps {
  onApplyTemplate?: (template: ProjectTemplate) => void;
  showProjectIntegration?: boolean;
  projectId?: string;
  projectName?: string;
}

export function TaskTemplateSystem({
  onApplyTemplate,
  showProjectIntegration = false,
  projectId = '',
  projectName = ''
}: TaskTemplateSystemProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  const stats = getTemplateStats(WEB_PROJECT_TEMPLATE);

  const handleApplyTemplate = (template: ProjectTemplate) => {
    if (onApplyTemplate) {
      onApplyTemplate(template);
    } else {
      setShowTemplateModal(true);
    }
  };

  const handleCreateTasksFromTemplate = (selectedTasks: TemplateTask[], projectId: string, projectName: string) => {
    // TODO: Implémenter la création des tâches
    console.log('Création des tâches:', { selectedTasks, projectId, projectName });
  };

  return (
    <div className="space-y-6">
      {/* En-tête principal */}
      <Card className="bg-gradient-to-r from-primary/10 to-indigo-500/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl text-foreground">
                  Système de Templates de Tâches
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Créez automatiquement toutes les tâches standard pour vos projets web
                </p>
              </div>
            </div>
            
            {showProjectIntegration && (
              <Button 
                onClick={() => setShowTemplateModal(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Appliquer au projet
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="template" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Template complet</span>
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Personnaliser</span>
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistiques principales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Vue d'ensemble du template</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-3xl font-bold text-primary">{stats.totalTasks}</div>
                      <div className="text-sm text-primary">Tâches totales</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-green-400">{stats.totalHours}h</div>
                      <div className="text-sm text-green-400">Heures estimées</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{stats.estimatedDuration} jours</div>
                    <div className="text-sm text-purple-400">Durée estimée (8h/jour)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catégories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Catégories de tâches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.categories.map(category => {
                    const categoryTasks = WEB_PROJECT_TEMPLATE.tasks.filter(task => task.category === category);
                    const categoryHours = categoryTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
                    const highPriorityCount = categoryTasks.filter(task => task.priority === 'high').length;
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-2 bg-surface-1 rounded-lg">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {categoryTasks.length} tâches
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {categoryHours}h
                          </Badge>
                          {highPriorityCount > 0 && (
                            <Badge className="bg-red-500/15 text-red-400 text-xs">
                              {highPriorityCount} haute priorité
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setActiveTab('template')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir le template complet
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('customize')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Personnaliser le template
                </Button>
                
                {showProjectIntegration && (
                  <Button 
                    onClick={() => setShowTemplateModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Appliquer au projet actuel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Template complet */}
        <TabsContent value="template">
          <ProjectTemplateManager 
            onApplyTemplate={handleApplyTemplate}
            showApplyButton={showProjectIntegration}
          />
        </TabsContent>

        {/* Personnalisation */}
        <TabsContent value="customize">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Personnalisation du template</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Personnalisation à venir
                </h3>
                <p className="text-muted-foreground mb-4">
                  Bientôt, vous pourrez personnaliser ce template selon vos besoins spécifiques
                </p>
                <Button variant="outline" disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Personnaliser le template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal d'application du template */}
      {showTemplateModal && projectId && projectName && (
        <ProjectTemplateModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onApplyTemplate={handleCreateTasksFromTemplate}
          projectId={projectId}
          projectName={projectName}
        />
      )}
    </div>
  );
}
