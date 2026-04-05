import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Settings, 
  Eye, 
  Edit, 
  Play,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { ProjectTemplateManager } from './ProjectTemplateManager';
import { TemplateEditor } from './TemplateEditor';
import { TemplateSyncModal } from './TemplateSyncModal';
import { type ProjectTemplate } from './projectTemplates';

interface TemplateManagerModalProps {
  open: boolean;
  onClose: () => void;
  onApplyTemplate?: (template: ProjectTemplate) => void;
}

export function TemplateManagerModal({ 
  open, 
  onClose, 
  onApplyTemplate 
}: TemplateManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [showSyncModal, setShowSyncModal] = useState(false);

  const handleSaveTemplate = (template: ProjectTemplate) => {
    // Ici, vous pourriez sauvegarder le template modifié
    // Pour l'instant, on affiche juste un message de succès
    console.log('Template sauvegardé:', template);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Gestionnaire de Templates</span>
            </DialogTitle>
            <div className="flex space-x-2">
              <Badge 
                variant={activeTab === 'view' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setActiveTab('view')}
              >
                <Eye className="h-3 w-3 mr-1" />
                Visualiser
              </Badge>
              <Badge 
                variant={activeTab === 'edit' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setActiveTab('edit')}
              >
                <Edit className="h-3 w-3 mr-1" />
                Modifier
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {activeTab === 'view' ? (
            <ProjectTemplateManager 
              onApplyTemplate={onApplyTemplate}
              showApplyButton={false}
            />
          ) : (
            <TemplateEditor 
              onSave={handleSaveTemplate}
              onCancel={() => setActiveTab('view')}
            />
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="flex space-x-2">
            {activeTab === 'view' && (
              <Button 
                variant="outline"
                onClick={() => setShowSyncModal(true)}
                className="text-primary border-primary/20 hover:bg-primary/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Synchroniser les projets existants
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {activeTab === 'view' && onApplyTemplate && (
              <Button 
                onClick={() => {
                  // Appliquer le template par défaut
                  onApplyTemplate({
                    id: 'web-project-standard',
                    name: 'Projet Web Standard',
                    description: 'Template complet pour tous les projets web',
                    tasks: [] // Le template sera chargé depuis projectTemplates.ts
                  });
                  onClose();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Appliquer le template
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Modal de synchronisation */}
      <TemplateSyncModal
        open={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        onSyncComplete={() => {
          setShowSyncModal(false);
          // Optionnel: rafraîchir les données
        }}
      />
    </Dialog>
  );
}
