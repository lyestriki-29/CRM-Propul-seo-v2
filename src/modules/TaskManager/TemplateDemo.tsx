import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Target,
  Play,
  Settings,
  Eye,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Rocket
} from 'lucide-react';
import { TaskTemplateSystem } from './TaskTemplateSystem';
import { ProjectTemplateIntegration } from '../ProjectsManager/ProjectTemplateIntegration';

export function TemplateDemo() {
  const [showFullSystem, setShowFullSystem] = useState(false);
  const [demoProjectId] = useState('demo-project-123');
  const [demoProjectName] = useState('Site E-commerce Demo');

  return (
    <div className="space-y-6">
      {/* En-tête de démonstration */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Rocket className="h-12 w-12 text-purple-400" />
            </div>
            <CardTitle className="text-3xl text-foreground mb-2">
              🎯 Démonstration du Système de Templates
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Testez le système de création automatique de tâches pour vos projets web
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Options de démonstration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Démo intégrée au projet */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Target className="h-5 w-5" />
              <span>Intégration Projet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Simule l'intégration du template dans un projet existant
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="font-medium text-primary">Projet de démonstration</div>
                <div className="text-sm text-primary/80">{demoProjectName}</div>
                <div className="text-xs text-primary/60">ID: {demoProjectId}</div>
              </div>
              
              <ProjectTemplateIntegration
                projectId={demoProjectId}
                projectName={demoProjectName}
                onTasksCreated={(taskCount) => {
                  console.log(`🎉 ${taskCount} tâches créées pour le projet de démonstration !`);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Démo système complet */}
        <Card className="border-2 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-400">
              <Settings className="h-5 w-5" />
              <span>Système Complet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Explorez toutes les fonctionnalités du système de templates
            </p>
            
            <Button 
              onClick={() => setShowFullSystem(!showFullSystem)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {showFullSystem ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Masquer le système complet
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Afficher le système complet
                </>
              )}
            </Button>
            
            {showFullSystem && (
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-sm text-green-400">
                  <div className="font-medium mb-2">Fonctionnalités disponibles :</div>
                  <div className="space-y-1">
                    <div>• Vue d'ensemble avec statistiques</div>
                    <div>• Template complet détaillé</div>
                    <div>• Personnalisation (à venir)</div>
                    <div>• Intégration avec projets</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Système complet (conditionnel) */}
      {showFullSystem && (
        <Card className="border-2 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-400">
              <Target className="h-5 w-5" />
              <span>Système de Templates Complet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaskTemplateSystem 
              showProjectIntegration={true}
              projectId={demoProjectId}
              projectName={demoProjectName}
            />
          </CardContent>
        </Card>
      )}

      {/* Informations de test */}
      <Card className="bg-amber-500/10 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-400">
            <AlertCircle className="h-5 w-5" />
            <span>Mode Démonstration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-amber-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Ceci est une démonstration - aucune tâche réelle ne sera créée</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Utilisez la console pour voir les logs de création</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Testez toutes les fonctionnalités sans risque</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-surface-2/30 rounded-lg border border-amber-500/30">
            <div className="text-sm text-amber-400">
              <div className="font-medium mb-2">Comment tester :</div>
              <div className="space-y-1">
                <div>1. Cliquez sur "Appliquer le template complet"</div>
                <div>2. Regardez la console pour les logs</div>
                <div>3. Explorez les différents onglets du système</div>
                <div>4. Testez la personnalisation (à venir)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
